import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { desc, eq } from 'drizzle-orm';
import {
  db, orders, payments, gameAccounts, topupPackages, topupGames, users,
} from '../db';
import { optionalAuth } from '../middleware/auth';

const router = Router();

const createOrderSchema = z.object({
  orderType: z.enum(['ACCOUNT', 'TOPUP']),
  gameAccountId: z.coerce.number().int().positive().optional(),
  topupPackageId: z.coerce.number().int().positive().optional(),
  targetMetadata: z
    .object({
      playerUid: z.string().trim().optional(),
      robloxUsername: z.string().trim().optional(),
      robloxPassword: z.string().optional(),
    })
    .optional(),
});

function buildPromptPayQrPayload(transactionRef: string, amount: number): string {
  const amtStr = amount.toFixed(2);
  const amtLen = amtStr.length.toString().padStart(2, '0');
  const refLen = transactionRef.length.toString().padStart(2, '0');
  return `00020101021229370016A000000677010111011300668000000005802TH530376454${amtLen}${amtStr}621705${refLen}${transactionRef}6304IQBK`;
}

async function resolveUserId(req: Request): Promise<number> {
  if (req.user?.id) return req.user.id;
  const [fallbackUser] = await db.select().from(users).limit(1);
  return fallbackUser ? fallbackUser.id : 1;
}

// POST /api/orders — Create order & dynamic QR payment
router.post('/', optionalAuth, async (req: Request, res: Response) => {
  try {
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid order request' });
      return;
    }

    const { orderType, gameAccountId, topupPackageId, targetMetadata } = parsed.data;
    const userId = await resolveUserId(req);
    let totalAmount = 0;
    let itemTitle = '';

    if (orderType === 'ACCOUNT') {
      if (!gameAccountId) {
        res.status(400).json({ error: 'gameAccountId is required for ACCOUNT orders' });
        return;
      }
      const [account] = await db.select().from(gameAccounts).where(eq(gameAccounts.id, gameAccountId)).limit(1);
      if (!account) {
        res.status(404).json({ error: 'Game account not found' });
        return;
      }
      if (account.status === 'SOLD') {
        res.status(409).json({ error: 'This game account has already been sold' });
        return;
      }
      totalAmount = account.price;
      itemTitle = account.title;
    } else {
      if (!topupPackageId) {
        res.status(400).json({ error: 'topupPackageId is required for TOPUP orders' });
        return;
      }
      const [pkg] = await db.select().from(topupPackages).where(eq(topupPackages.id, topupPackageId)).limit(1);
      if (!pkg) {
        res.status(404).json({ error: 'Top-up package not found' });
        return;
      }
      totalAmount = pkg.price;
      itemTitle = pkg.packageName;
    }

    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `ORD-${datePart}-${randSuffix.toString().slice(0, 4)}`;
    const transactionRef = `IQB-TX-${randSuffix}`;
    const qrPayload = buildPromptPayQrPayload(transactionRef, totalAmount);

    const [createdOrder] = await db
      .insert(orders)
      .values({
        orderNumber,
        userId,
        orderType,
        gameAccountId: orderType === 'ACCOUNT' ? gameAccountId : null,
        topupPackageId: orderType === 'TOPUP' ? topupPackageId : null,
        targetMetadata: orderType === 'TOPUP' ? targetMetadata || {} : null,
        totalAmount,
        status: 'PENDING',
        fulfillmentStatus: 'PENDING',
      })
      .returning();

    const [createdPayment] = await db
      .insert(payments)
      .values({
        orderId: createdOrder.id,
        transactionRef,
        provider: 'IQ_BANK',
        amount: totalAmount,
        qrPayload,
        status: 'WAITING',
      })
      .returning();

    res.status(201).json({ order: { ...createdOrder, title: itemTitle }, payment: createdPayment });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// GET /api/orders — List customer orders (reveals credentials ONLY when status === 'PAID')
router.get('/', optionalAuth, async (req: Request, res: Response) => {
  try {
    const userId = await resolveUserId(req);
    const userOrders = await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
    const allPayments = await db.select().from(payments);
    const allAccounts = await db.select().from(gameAccounts);
    const allPackages = await db.select().from(topupPackages);
    const allGames = await db.select().from(topupGames);

    const enriched = userOrders.map((ord) => {
      const payment = allPayments.find((p) => p.orderId === ord.id);
      const account = ord.gameAccountId ? allAccounts.find((a) => a.id === ord.gameAccountId) : undefined;
      const pkg = ord.topupPackageId ? allPackages.find((p) => p.id === ord.topupPackageId) : undefined;
      const game = pkg ? allGames.find((g) => g.id === pkg.gameId) : undefined;

      const isPaid = ord.status === 'PAID';
      const credentials = isPaid && account
        ? { accountUsername: account.accountUsername, accountPassword: account.accountPassword }
        : null;

      const title = ord.orderType === 'ACCOUNT'
        ? account?.title || 'Game Account'
        : `${game?.name || 'Game'} - ${pkg?.packageName || 'Top-Up'}`;

      const typeLabel = ord.orderType === 'ACCOUNT'
        ? `Account (${account?.gameCategory || 'Game'})`
        : ord.targetMetadata?.playerUid
          ? `Top-Up (UID: ${ord.targetMetadata.playerUid})`
          : `Top-Up (User: ${ord.targetMetadata?.robloxUsername || 'N/A'})`;

      return {
        ...ord,
        id: ord.orderNumber,
        dbId: ord.id,
        ref: payment?.transactionRef || 'IQB-TX-000000',
        title,
        type: typeLabel,
        date: new Date(ord.createdAt).toLocaleString('en-GB', {
          day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
        }),
        amount: ord.totalAmount,
        revealedUser: credentials?.accountUsername || 'Direct Server Delivery',
        revealedPass: credentials?.accountPassword || ord.fulfillmentStatus,
        credentials,
        payment,
      };
    });

    res.json({ orders: enriched });
  } catch (err) {
    console.error('List orders error:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/orders/:id/status — Poll live payment & fulfillment status
router.get('/:id/status', async (req: Request, res: Response) => {
  try {
    const param = String(req.params.id);
    const numericId = Number(param);

    let [ord] = await db
      .select()
      .from(orders)
      .where(!Number.isNaN(numericId) ? eq(orders.id, numericId) : eq(orders.orderNumber, param))
      .limit(1);

    if (!ord) {
      const [payByRef] = await db.select().from(payments).where(eq(payments.transactionRef, param)).limit(1);
      if (payByRef) {
        [ord] = await db.select().from(orders).where(eq(orders.id, payByRef.orderId)).limit(1);
      }
    }

    if (!ord) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    const [payment] = await db.select().from(payments).where(eq(payments.orderId, ord.id)).limit(1);

    let credentials = null;
    if (ord.status === 'PAID' && ord.orderType === 'ACCOUNT' && ord.gameAccountId) {
      const [acc] = await db
        .select({ accountUsername: gameAccounts.accountUsername, accountPassword: gameAccounts.accountPassword })
        .from(gameAccounts)
        .where(eq(gameAccounts.id, ord.gameAccountId))
        .limit(1);
      if (acc) credentials = acc;
    }

    res.json({
      status: ord.status,
      fulfillmentStatus: ord.fulfillmentStatus,
      order: { ...ord, credentials },
      payment,
      credentials,
    });
  } catch (err) {
    console.error('Order status poll error:', err);
    res.status(500).json({ error: 'Failed to check order status' });
  }
});

export default router;
