import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { and, desc, eq } from 'drizzle-orm';
import {
  db, orders, payments, gameAccounts, topupPackages, topupGames, users,
} from '../db';
import { optionalAuth, requireAuth } from '../middleware/auth';

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

// POST /api/orders — Create order & dynamic QR payment
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid order request' });
      return;
    }

    const { orderType, gameAccountId, topupPackageId, targetMetadata } = parsed.data;
    const userId = req.user!.id;
    let totalAmount = 0;
    let itemTitle = '';

    if (orderType === 'ACCOUNT') {
      if (!gameAccountId) {
        res.status(400).json({ error: 'gameAccountId is required for ACCOUNT orders' });
        return;
      }
      // Atomic reservation to prevent TOCTOU race conditions
      const [reservedAccount] = await db
        .update(gameAccounts)
        .set({ status: 'RESERVED' })
        .where(and(eq(gameAccounts.id, gameAccountId), eq(gameAccounts.status, 'AVAILABLE')))
        .returning();

      if (!reservedAccount) {
        const [existing] = await db.select().from(gameAccounts).where(eq(gameAccounts.id, gameAccountId)).limit(1);
        if (!existing) {
          res.status(404).json({ error: 'Game account not found' });
          return;
        }
        res.status(409).json({
          error:
            existing.status === 'SOLD'
              ? 'This game account has already been sold'
              : 'This game account is currently reserved for checkout',
        });
        return;
      }
      totalAmount = reservedAccount.price;
      itemTitle = reservedAccount.title;
    } else {
      if (!topupPackageId) {
        res.status(400).json({ error: 'topupPackageId is required for TOPUP orders' });
        return;
      }
      const [pkg] = await db.select().from(topupPackages).where(eq(topupPackages.id, topupPackageId)).limit(1);
      if (!pkg || !pkg.isActive) {
        res.status(404).json({ error: 'Top-up package not found or inactive' });
        return;
      }
      const [game] = await db.select().from(topupGames).where(eq(topupGames.id, pkg.gameId)).limit(1);
      if (!game || !game.isActive) {
        res.status(404).json({ error: 'Game not found or inactive' });
        return;
      }
      if (game.inputMode === 'UID') {
        const uid = targetMetadata?.playerUid?.trim();
        if (!uid || !/^[a-zA-Z0-9_-]{3,32}$/.test(uid)) {
          res.status(400).json({ error: 'Valid player UID is required (3-32 characters)' });
          return;
        }
      } else if (game.inputMode === 'ID_PASS') {
        const robloxUser = targetMetadata?.robloxUsername?.trim();
        const robloxPass = targetMetadata?.robloxPassword;
        if (!robloxUser || robloxUser.length < 3) {
          res.status(400).json({ error: 'Roblox username is required (minimum 3 characters)' });
          return;
        }
        if (!robloxPass || robloxPass.length < 4) {
          res.status(400).json({ error: 'Roblox password is required (minimum 4 characters)' });
          return;
        }
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
    if (req.body?.orderType === 'ACCOUNT' && req.body?.gameAccountId) {
      await db
        .update(gameAccounts)
        .set({ status: 'AVAILABLE' })
        .where(and(eq(gameAccounts.id, Number(req.body.gameAccountId)), eq(gameAccounts.status, 'RESERVED')))
        .catch(() => {});
    }
    console.error('Create order error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// GET /api/orders — List customer orders (reveals credentials ONLY when status === 'PAID')
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
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

// GET /api/orders/:id/status — Poll live payment & fulfillment status (protects credentials from IDOR)
router.get('/:id/status', optionalAuth, async (req: Request, res: Response) => {
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
    const isAuthorized = req.user && (req.user.id === ord.userId || req.user.role === 'ADMIN');
    if (ord.status === 'PAID' && ord.orderType === 'ACCOUNT' && ord.gameAccountId && isAuthorized) {
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
