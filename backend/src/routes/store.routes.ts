import { Router, Request, Response } from 'express';
import { and, asc, desc, eq } from 'drizzle-orm';
import { db, banners, gameAccounts, topupGames, topupPackages } from '../db';

const router = Router();

// GET /api/banners — Fetch active homepage banners ordered by sortOrder
router.get('/banners', async (_req: Request, res: Response) => {
  try {
    const activeBanners = await db
      .select()
      .from(banners)
      .where(eq(banners.isActive, true))
      .orderBy(asc(banners.sortOrder), asc(banners.id));

    res.json({ banners: activeBanners });
  } catch (err) {
    console.error('Fetch banners error:', err);
    res.status(500).json({ error: 'Failed to fetch homepage banners' });
  }
});

// GET /api/accounts — List marketplace accounts (NEVER exposes accountUsername or accountPassword)
router.get('/accounts', async (req: Request, res: Response) => {
  try {
    const rawCategory = (
      (req.query.category as string) ||
      (req.query.gameCategory as string) ||
      ''
    )
      .trim()
      .toUpperCase();
    const rawStatus = ((req.query.status as string) || '').trim().toUpperCase();
    const sort = ((req.query.sort as string) || 'featured').trim().toLowerCase();

    const conditions = [];

    if (rawCategory === 'ROBLOX' || rawCategory === 'ROV') {
      conditions.push(eq(gameAccounts.gameCategory, rawCategory));
    }

    if (
      rawStatus === 'AVAILABLE' ||
      rawStatus === 'RESERVED' ||
      rawStatus === 'SOLD'
    ) {
      conditions.push(eq(gameAccounts.status, rawStatus));
    }

    const orderByClause =
      sort === 'price-asc'
        ? [asc(gameAccounts.price), asc(gameAccounts.id)]
        : sort === 'price-desc'
          ? [desc(gameAccounts.price), asc(gameAccounts.id)]
          : [asc(gameAccounts.id)];

    const rows = await db
      .select({
        id: gameAccounts.id,
        gameCategory: gameAccounts.gameCategory,
        title: gameAccounts.title,
        description: gameAccounts.description,
        highlightTags: gameAccounts.highlightTags,
        specs: gameAccounts.specs,
        price: gameAccounts.price,
        imageUrl: gameAccounts.imageUrl,
        status: gameAccounts.status,
        createdAt: gameAccounts.createdAt,
      })
      .from(gameAccounts)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(...orderByClause);

    res.json({ accounts: rows });
  } catch (err) {
    console.error('Fetch accounts error:', err);
    res.status(500).json({ error: 'Failed to fetch marketplace accounts' });
  }
});

// GET /api/topup/games — List active top-up games with their active packages
router.get('/topup/games', async (_req: Request, res: Response) => {
  try {
    const games = await db
      .select()
      .from(topupGames)
      .where(eq(topupGames.isActive, true))
      .orderBy(asc(topupGames.id));

    const pkgs = await db
      .select()
      .from(topupPackages)
      .where(eq(topupPackages.isActive, true))
      .orderBy(asc(topupPackages.price), asc(topupPackages.id));

    const gamesWithPackages = games.map((game) => ({
      ...game,
      packages: pkgs.filter((pkg) => pkg.gameId === game.id),
    }));

    res.json({ games: gamesWithPackages });
  } catch (err) {
    console.error('Fetch topup games error:', err);
    res.status(500).json({ error: 'Failed to fetch top-up games and packages' });
  }
});

export default router;
