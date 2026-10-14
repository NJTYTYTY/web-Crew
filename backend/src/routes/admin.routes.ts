import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { asc, desc, eq } from 'drizzle-orm';
import {
  db, users, banners, gameAccounts, topupGames, topupPackages, orders, payments,
} from '../db';
import { requireAdmin } from '../middleware/auth';

const router = Router();
router.use(requireAdmin);

const accountSchema = z.object({
  gameCategory: z.enum(['ROBLOX', 'ROV']),
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  highlightTags: z.array(z.string()).default([]),
  specs: z
    .object({
      levelOrRank: z.string().optional(),
      heroesOrFruitsCount: z.string().optional(),
      skinsOrWeaponsCount: z.string().optional(),
      serverRegion: z.string().optional(),
      emailStatus: z.string().optional(),
    })
    .optional()
    .nullable(),
  price: z.coerce.number().int().nonnegative(),
  imageUrl: z.string().min(1),
  accountUsername: z.string().min(1),
  accountPassword: z.string().min(1),
  status: z.enum(['AVAILABLE', 'RESERVED', 'SOLD']).default('AVAILABLE'),
});

const packageSchema = z.object({
  gameId: z.coerce.number().int().positive(),
  packageName: z.string().min(1),
  bonusTag: z.string().optional().nullable(),
  price: z.coerce.number().int().nonnegative(),
  isActive: z.boolean().default(true),
});

const gameUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  iconUrl: z.string().min(1).optional(),
  inputMode: z.enum(['UID', 'ID_PASS']).optional(),
  isActive: z.boolean().optional(),
});

const bannerSchema = z.object({
  title: z.string().min(1),
  imageUrl: z.string().min(1),
  linkUrl: z.string().optional().nullable(),
  sortOrder: z.coerce.number().int().default(1),
  isActive: z.boolean().default(true),
});

const orderUpdateSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'CANCELLED']).optional(),
  fulfillmentStatus: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']).optional(),
});

// 1. GET /api/admin/overview
router.get('/overview', async (_req: Request, res: Response) => {
  try {
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    const allAccounts = await db.select().from(gameAccounts);
    const allBanners = await db.select().from(banners);
    const allPayments = await db.select().from(payments);
    const allUsers = await db.select({ id: users.id, username: users.username }).from(users);

    const totalRevenue = allOrders
      .filter((o) => o.status === 'PAID')
      .reduce((sum, o) => sum + o.totalAmount, 0);
    const accountsSold = allAccounts.filter((a) => a.status === 'SOLD').length;
    const pendingTopups = allOrders.filter(
      (o) => o.orderType === 'TOPUP' && o.fulfillmentStatus !== 'COMPLETED'
    ).length;
    const activeBanners = allBanners.filter((b) => b.isActive).length;

    const recentTransactions = allOrders.slice(0, 15).map((ord) => {
      const payment = allPayments.find((p) => p.orderId === ord.id);
      const customer = allUsers.find((u) => u.id === ord.userId);
      return {
        ...ord,
        username: customer?.username || 'customer',
        transactionRef: payment?.transactionRef || 'N/A',
        paymentStatus: payment?.status || 'WAITING',
        rawWebhookPayload: payment?.rawWebhookPayload || null,
      };
    });

    res.json({
      kpis: { totalRevenue, accountsSold, pendingTopups, activeBanners },
      recentTransactions,
    });
  } catch (err) {
    console.error('Admin overview error:', err);
    res.status(500).json({ error: 'Failed to load admin overview' });
  }
});

// 2. Game Accounts CRUD (/api/admin/accounts)
router.get('/accounts', async (_req: Request, res: Response) => {
  const rows = await db.select().from(gameAccounts).orderBy(asc(gameAccounts.id));
  res.json({ accounts: rows });
});

router.post('/accounts', async (req: Request, res: Response) => {
  const parsed = accountSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid account payload' });
    return;
  }
  const [created] = await db.insert(gameAccounts).values(parsed.data).returning();
  res.status(201).json({ account: created });
});

const updateAccountHandler = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const parsed = accountSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid update payload' });
    return;
  }
  const [updated] = await db
    .update(gameAccounts)
    .set(parsed.data)
    .where(eq(gameAccounts.id, id))
    .returning();
  res.json({ account: updated });
};
router.patch('/accounts/:id', updateAccountHandler);
router.put('/accounts/:id', updateAccountHandler);

router.delete('/accounts/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await db.delete(gameAccounts).where(eq(gameAccounts.id, id));
  res.json({ success: true });
});

// 3. Top-Up Games & Packages CRUD (/api/admin/topup)
router.get('/topup', async (_req: Request, res: Response) => {
  const games = await db.select().from(topupGames).orderBy(asc(topupGames.id));
  const packages = await db.select().from(topupPackages).orderBy(asc(topupPackages.id));
  res.json({
    games: games.map((g) => ({ ...g, packages: packages.filter((p) => p.gameId === g.id) })),
    packages,
  });
});

router.post('/topup', async (req: Request, res: Response) => {
  const parsed = packageSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid package payload' });
    return;
  }
  const [created] = await db.insert(topupPackages).values(parsed.data).returning();
  res.status(201).json({ package: created });
});

const updateGameHandler = async (req: Request, res: Response) => {
  const slug = String(req.params.slug || '').toLowerCase();
  const parsed = gameUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid game update' });
    return;
  }
  const [updated] = await db
    .update(topupGames)
    .set(parsed.data)
    .where(eq(topupGames.slug, slug))
    .returning();
  res.json({ game: updated });
};
router.patch('/topup/games/:slug', updateGameHandler);
router.put('/topup/games/:slug', updateGameHandler);

const updatePackageHandler = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const parsed = packageSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid package update' });
    return;
  }
  const [updated] = await db
    .update(topupPackages)
    .set(parsed.data)
    .where(eq(topupPackages.id, id))
    .returning();
  res.json({ package: updated });
};
router.patch('/topup/:id', updatePackageHandler);
router.put('/topup/:id', updatePackageHandler);

router.delete('/topup/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await db.delete(topupPackages).where(eq(topupPackages.id, id));
  res.json({ success: true });
});

// 4. Orders, Top-Up Queue & Webhook Logs (/api/admin/orders)
router.get('/orders', async (_req: Request, res: Response) => {
  const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
  const allPayments = await db.select().from(payments);
  const allUsers = await db.select({ id: users.id, username: users.username }).from(users);
  const allAccounts = await db.select().from(gameAccounts);
  const allPackages = await db.select().from(topupPackages);

  const enriched = allOrders.map((ord) => {
    const payment = allPayments.find((p) => p.orderId === ord.id);
    const user = allUsers.find((u) => u.id === ord.userId);
    const account = ord.gameAccountId ? allAccounts.find((a) => a.id === ord.gameAccountId) : null;
    const pkg = ord.topupPackageId ? allPackages.find((p) => p.id === ord.topupPackageId) : null;
    return {
      ...ord,
      username: user?.username || 'customer',
      itemTitle: account?.title || pkg?.packageName || 'Order Item',
      payment: payment || null,
    };
  });

  res.json({ orders: enriched });
});

router.patch('/orders/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const parsed = orderUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid order update' });
    return;
  }
  const [updated] = await db.update(orders).set(parsed.data).where(eq(orders.id, id)).returning();
  res.json({ order: updated });
});

// 5. Homepage Banners CRUD (/api/admin/banners)
router.get('/banners', async (_req: Request, res: Response) => {
  const rows = await db.select().from(banners).orderBy(asc(banners.sortOrder), asc(banners.id));
  res.json({ banners: rows });
});

router.post('/banners', async (req: Request, res: Response) => {
  const parsed = bannerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid banner payload' });
    return;
  }
  const [created] = await db.insert(banners).values(parsed.data).returning();
  res.status(201).json({ banner: created });
});

const updateBannerHandler = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const parsed = bannerSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid banner update' });
    return;
  }
  const [updated] = await db.update(banners).set(parsed.data).where(eq(banners.id, id)).returning();
  res.json({ banner: updated });
};
router.patch('/banners/:id', updateBannerHandler);
router.put('/banners/:id', updateBannerHandler);

router.delete('/banners/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await db.delete(banners).where(eq(banners.id, id));
  res.json({ success: true });
});

export default router;
