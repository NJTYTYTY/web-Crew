import { Router, Request, Response } from 'express';
import { asc, desc, eq } from 'drizzle-orm';
import {
  db, users, banners, gameAccounts, topupGames, topupPackages, orders, payments,
} from '../db';
import { requireAdmin } from '../middleware/auth';
import {
  accountSchema,
  bannerSchema,
  gameCreateSchema,
  gameUpdateSchema,
  orderUpdateSchema,
  packageSchema,
} from './admin.schemas';

const router = Router();
router.use(requireAdmin);

// 1. GET /api/admin/overview
router.get('/overview', async (_req: Request, res: Response) => {
  try {
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    const allAccounts = await db.select().from(gameAccounts);
    const allBanners = await db.select().from(banners).orderBy(asc(banners.sortOrder));
    const allPayments = await db.select().from(payments);
    const allPackages = await db.select().from(topupPackages);
    const allGames = await db.select().from(topupGames);
    const allUsers = await db.select({ id: users.id, username: users.username }).from(users);

    const totalRevenue = allOrders.filter((o) => o.status === 'PAID').reduce((sum, o) => sum + o.totalAmount, 0);
    const accountsSold = allAccounts.filter((a) => a.status === 'SOLD').length;
    const totalAccounts = allAccounts.length;
    const inStockAccounts = allAccounts.filter((a) => a.status === 'AVAILABLE').length;
    const rovAccountsCount = allAccounts.filter((a) => a.gameCategory === 'ROV').length;
    const robloxAccountsCount = allAccounts.filter((a) => a.gameCategory === 'ROBLOX').length;
    const pendingTopups = allOrders.filter(
      (o) => o.orderType === 'TOPUP' && o.fulfillmentStatus !== 'COMPLETED' && o.status !== 'CANCELLED'
    ).length;
    const completedOrdersCount = allOrders.filter((o) => o.fulfillmentStatus === 'COMPLETED').length;
    const activeBannersList = allBanners.filter((b) => b.isActive);
    const activeBanners = activeBannersList.length;

    const recentTransactions = allOrders.slice(0, 15).map((ord) => {
      const payment = allPayments.find((p) => p.orderId === ord.id);
      const customer = allUsers.find((u) => u.id === ord.userId);
      const account = ord.gameAccountId ? allAccounts.find((a) => a.id === ord.gameAccountId) : null;
      const pkg = ord.topupPackageId ? allPackages.find((p) => p.id === ord.topupPackageId) : null;
      const game = pkg ? allGames.find((g) => g.id === pkg.gameId) : null;
      return {
        ...ord,
        username: customer?.username || 'customer',
        itemTitle: account?.title || (game ? `${game.name} — ${pkg?.packageName}` : pkg?.packageName) || 'Order Item',
        gameName: account ? (account.gameCategory === 'ROV' ? 'RoV' : account.gameCategory === 'ROBLOX' ? 'Roblox' : account.gameCategory) : game?.name || 'Top-Up',
        transactionRef: payment?.transactionRef || 'N/A',
        paymentStatus: payment?.status || (ord.status === 'PAID' ? 'SUCCESS' : 'WAITING'),
        rawWebhookPayload: payment?.rawWebhookPayload || null,
      };
    });

    res.json({
      kpis: {
        totalRevenue,
        accountsSold,
        totalAccounts,
        inStockAccounts,
        rovAccountsCount,
        robloxAccountsCount,
        pendingTopups,
        completedOrdersCount,
        totalOrdersCount: allOrders.length,
        activeBanners,
        totalBanners: allBanners.length,
        firstActiveBannerTitle: activeBannersList[0]?.title || 'Active Hero Campaign',
      },
      recentTransactions,
    });
  } catch (err) {
    console.error('Admin overview error:', err);
    res.status(500).json({ error: 'Failed to load admin overview' });
  }
});

// 2. Game Accounts CRUD (/api/admin/accounts)
router.get('/accounts', async (_req: Request, res: Response) => {
  try {
    const rows = await db.select().from(gameAccounts).orderBy(asc(gameAccounts.id));
    res.json({ accounts: rows });
  } catch (err) {
    console.error('Get accounts error:', err);
    res.status(500).json({ error: 'Failed to load game accounts' });
  }
});

router.post('/accounts', async (req: Request, res: Response) => {
  try {
    const parsed = accountSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid account payload' });
      return;
    }
    const [created] = await db.insert(gameAccounts).values(parsed.data).returning();
    res.status(201).json({ account: created });
  } catch (err) {
    console.error('Create account error:', err);
    res.status(500).json({ error: 'Failed to create game account' });
  }
});

const updateAccountHandler = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id) || id <= 0) {
      res.status(400).json({ error: 'Invalid account ID' });
      return;
    }
    const parsed = accountSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid update payload' });
      return;
    }
    if (Object.keys(parsed.data).length === 0) {
      res.status(400).json({ error: 'No update fields provided' });
      return;
    }
    const [updated] = await db.update(gameAccounts).set(parsed.data).where(eq(gameAccounts.id, id)).returning();
    if (!updated) {
      res.status(404).json({ error: 'Game account not found' });
      return;
    }
    res.json({ account: updated });
  } catch (err) {
    console.error('Update account error:', err);
    res.status(500).json({ error: 'Failed to update game account' });
  }
};
router.route('/accounts/:id').patch(updateAccountHandler).put(updateAccountHandler);

router.delete('/accounts/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id) || id <= 0) {
      res.status(400).json({ error: 'Invalid account ID' });
      return;
    }
    const [existing] = await db.select().from(gameAccounts).where(eq(gameAccounts.id, id)).limit(1);
    if (!existing) {
      res.status(404).json({ error: 'Game account not found' });
      return;
    }
    const tiedOrders = await db.select({ id: orders.id }).from(orders).where(eq(orders.gameAccountId, id)).limit(1);
    if (tiedOrders.length > 0) {
      res.status(409).json({ error: 'Cannot delete an account with existing orders. Mark status as SOLD instead.' });
      return;
    }
    await db.delete(gameAccounts).where(eq(gameAccounts.id, id));
    res.json({ success: true });
  } catch (err) {
    console.error('Delete account error:', err);
    res.status(500).json({ error: 'Failed to delete game account' });
  }
});

// 3. Top-Up Games & Packages CRUD (/api/admin/topup)
router.get('/topup', async (_req: Request, res: Response) => {
  try {
    const games = await db.select().from(topupGames).orderBy(asc(topupGames.id));
    const packages = await db.select().from(topupPackages).orderBy(asc(topupPackages.id));
    res.json({
      games: games.map((g) => ({ ...g, packages: packages.filter((p) => p.gameId === g.id) })),
      packages,
    });
  } catch (err) {
    console.error('Get topup error:', err);
    res.status(500).json({ error: 'Failed to load top-up data' });
  }
});

router.post('/topup', async (req: Request, res: Response) => {
  try {
    const parsed = packageSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid package payload' });
      return;
    }
    const [game] = await db.select().from(topupGames).where(eq(topupGames.id, parsed.data.gameId)).limit(1);
    if (!game) {
      res.status(404).json({ error: 'Target top-up game not found' });
      return;
    }
    const [created] = await db.insert(topupPackages).values(parsed.data).returning();
    res.status(201).json({ package: created });
  } catch (err) {
    console.error('Create package error:', err);
    res.status(500).json({ error: 'Failed to create top-up package' });
  }
});

router.post('/topup/games', async (req: Request, res: Response) => {
  try {
    const parsed = gameCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid game payload' });
      return;
    }
    const slug = parsed.data.slug.toLowerCase();
    const [existing] = await db
      .select({ id: topupGames.id })
      .from(topupGames)
      .where(eq(topupGames.slug, slug))
      .limit(1);

    if (existing) {
      res.status(409).json({ error: `Game with slug "${slug}" already exists` });
      return;
    }

    const [created] = await db
      .insert(topupGames)
      .values({ ...parsed.data, slug })
      .returning();
    res.status(201).json({ game: created });
  } catch (err) {
    console.error('Create game error:', err);
    res.status(500).json({ error: 'Failed to create top-up game' });
  }
});

router.delete('/topup/games/:slug', async (req: Request, res: Response) => {
  try {
    const slug = String(req.params.slug || '').toLowerCase();
    const [game] = await db.select().from(topupGames).where(eq(topupGames.slug, slug)).limit(1);
    if (!game) {
      res.status(404).json({ error: 'Top-up game not found' });
      return;
    }

    const pkgs = await db.select({ id: topupPackages.id }).from(topupPackages).where(eq(topupPackages.gameId, game.id));
    if (pkgs.length > 0) {
      const pkgIds = pkgs.map((p) => p.id);
      const allOrders = await db.select({ id: orders.id, topupPackageId: orders.topupPackageId }).from(orders);
      const hasOrders = allOrders.some((o) => o.topupPackageId && pkgIds.includes(o.topupPackageId));
      if (hasOrders) {
        res.status(409).json({
          error: `Cannot delete "${game.name}" because packages under it have order history. Please deactivate it instead.`,
        });
        return;
      }
      await db.delete(topupPackages).where(eq(topupPackages.gameId, game.id));
    }

    await db.delete(topupGames).where(eq(topupGames.id, game.id));
    res.json({ success: true, message: `Game ${game.name} deleted successfully` });
  } catch (err) {
    console.error('Delete game error:', err);
    res.status(500).json({ error: 'Failed to delete top-up game' });
  }
});

const updateGameHandler = async (req: Request, res: Response) => {
  try {
    const slug = String(req.params.slug || '').toLowerCase();
    if (!slug) {
      res.status(400).json({ error: 'Game slug is required' });
      return;
    }
    const parsed = gameUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid game update' });
      return;
    }
    if (Object.keys(parsed.data).length === 0) {
      res.status(400).json({ error: 'No update fields provided' });
      return;
    }
    const [updated] = await db.update(topupGames).set(parsed.data).where(eq(topupGames.slug, slug)).returning();
    if (!updated) {
      res.status(404).json({ error: 'Top-up game not found' });
      return;
    }
    res.json({ game: updated });
  } catch (err) {
    console.error('Update game error:', err);
    res.status(500).json({ error: 'Failed to update top-up game' });
  }
};
router.route('/topup/games/:slug').patch(updateGameHandler).put(updateGameHandler);

const updatePackageHandler = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id) || id <= 0) {
      res.status(400).json({ error: 'Invalid package ID' });
      return;
    }
    const parsed = packageSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid package update' });
      return;
    }
    if (Object.keys(parsed.data).length === 0) {
      res.status(400).json({ error: 'No update fields provided' });
      return;
    }
    const [updated] = await db.update(topupPackages).set(parsed.data).where(eq(topupPackages.id, id)).returning();
    if (!updated) {
      res.status(404).json({ error: 'Top-up package not found' });
      return;
    }
    res.json({ package: updated });
  } catch (err) {
    console.error('Update package error:', err);
    res.status(500).json({ error: 'Failed to update top-up package' });
  }
};
router.route('/topup/:id').patch(updatePackageHandler).put(updatePackageHandler);

router.delete('/topup/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id) || id <= 0) {
      res.status(400).json({ error: 'Invalid package ID' });
      return;
    }
    const [existing] = await db.select().from(topupPackages).where(eq(topupPackages.id, id)).limit(1);
    if (!existing) {
      res.status(404).json({ error: 'Package not found' });
      return;
    }
    const tiedOrders = await db.select({ id: orders.id }).from(orders).where(eq(orders.topupPackageId, id)).limit(1);
    if (tiedOrders.length > 0) {
      res.status(409).json({ error: 'Cannot delete package with past orders. Set active to false instead.' });
      return;
    }
    await db.delete(topupPackages).where(eq(topupPackages.id, id));
    res.json({ success: true });
  } catch (err) {
    console.error('Delete package error:', err);
    res.status(500).json({ error: 'Failed to delete top-up package' });
  }
});

// 4. Orders, Top-Up Queue & Webhook Logs (/api/admin/orders)
router.get('/orders', async (_req: Request, res: Response) => {
  try {
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    const allPayments = await db.select().from(payments);
    const allUsers = await db.select({ id: users.id, username: users.username }).from(users);
    const allAccounts = await db.select().from(gameAccounts);
    const allPackages = await db.select().from(topupPackages);
    const allGames = await db.select().from(topupGames);

    const enriched = allOrders.map((ord) => {
      const payment = allPayments.find((p) => p.orderId === ord.id);
      const user = allUsers.find((u) => u.id === ord.userId);
      const account = ord.gameAccountId ? allAccounts.find((a) => a.id === ord.gameAccountId) : null;
      const pkg = ord.topupPackageId ? allPackages.find((p) => p.id === ord.topupPackageId) : null;
      const game = pkg ? allGames.find((g) => g.id === pkg.gameId) : null;
      return {
        ...ord,
        username: user?.username || 'customer',
        itemTitle: account?.title || pkg?.packageName || 'Order Item',
        gameName: account ? (account.gameCategory === 'ROV' ? 'RoV' : 'Roblox') : game?.name || 'Game Top-Up',
        accountUsername: account?.accountUsername || null,
        accountPassword: account?.accountPassword || null,
        payment: payment || null,
      };
    });

    res.json({ orders: enriched });
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ error: 'Failed to load orders' });
  }
});

router.patch('/orders/:id', async (req: Request, res: Response) => {
  try {
    const param = String(req.params.id);
    const numId = Number(param);
    const parsed = orderUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid order update' });
      return;
    }
    if (Object.keys(parsed.data).length === 0) {
      res.status(400).json({ error: 'No update fields provided' });
      return;
    }
    const whereClause = !Number.isNaN(numId) && numId > 0 ? eq(orders.id, numId) : eq(orders.orderNumber, param);
    const [updated] = await db.update(orders).set(parsed.data).where(whereClause).returning();
    if (!updated) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    if (parsed.data.status) {
      const nextPayStatus =
        parsed.data.status === 'PAID' ? 'SUCCESS' : parsed.data.status === 'CANCELLED' ? 'FAILED' : 'WAITING';
      const paymentUpdate: any = { status: nextPayStatus };
      if (parsed.data.status === 'PAID') {
        paymentUpdate.paidAt = new Date();
      }
      await db.update(payments).set(paymentUpdate).where(eq(payments.orderId, updated.id));

      if (updated.gameAccountId) {
        if (parsed.data.status === 'PAID') {
          await db.update(gameAccounts).set({ status: 'SOLD' }).where(eq(gameAccounts.id, updated.gameAccountId));
        } else if (parsed.data.status === 'CANCELLED') {
          await db.update(gameAccounts).set({ status: 'AVAILABLE' }).where(eq(gameAccounts.id, updated.gameAccountId));
        }
      }
    }
    res.json({ order: updated });
  } catch (err) {
    console.error('Update order error:', err);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// 5. Homepage Banners CRUD (/api/admin/banners)
router.get('/banners', async (_req: Request, res: Response) => {
  try {
    const rows = await db.select().from(banners).orderBy(asc(banners.sortOrder), asc(banners.id));
    res.json({ banners: rows });
  } catch (err) {
    console.error('Get banners error:', err);
    res.status(500).json({ error: 'Failed to load banners' });
  }
});

router.post('/banners', async (req: Request, res: Response) => {
  try {
    const parsed = bannerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid banner payload' });
      return;
    }
    const [created] = await db.insert(banners).values(parsed.data).returning();
    res.status(201).json({ banner: created });
  } catch (err) {
    console.error('Create banner error:', err);
    res.status(500).json({ error: 'Failed to create banner' });
  }
});

const updateBannerHandler = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id) || id <= 0) {
      res.status(400).json({ error: 'Invalid banner ID' });
      return;
    }
    const parsed = bannerSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid banner update' });
      return;
    }
    if (Object.keys(parsed.data).length === 0) {
      res.status(400).json({ error: 'No update fields provided' });
      return;
    }
    const [updated] = await db.update(banners).set(parsed.data).where(eq(banners.id, id)).returning();
    if (!updated) {
      res.status(404).json({ error: 'Banner not found' });
      return;
    }
    res.json({ banner: updated });
  } catch (err) {
    console.error('Update banner error:', err);
    res.status(500).json({ error: 'Failed to update banner' });
  }
};
router.route('/banners/:id').patch(updateBannerHandler).put(updateBannerHandler);

router.delete('/banners/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id) || id <= 0) {
      res.status(400).json({ error: 'Invalid banner ID' });
      return;
    }
    const [deleted] = await db.delete(banners).where(eq(banners.id, id)).returning();
    if (!deleted) {
      res.status(404).json({ error: 'Banner not found' });
      return;
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Delete banner error:', err);
    res.status(500).json({ error: 'Failed to delete banner' });
  }
});

export default router;
