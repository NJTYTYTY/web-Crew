import bcrypt from 'bcrypt';
import { count } from 'drizzle-orm';
import {
  db, pool, users, banners, gameAccounts, topupGames, topupPackages, orders, payments,
} from './index';

async function seed() {
  console.log('🌱 Starting NEXUS PLAY database seed...');

  // 1. Seed Default Users (idempotent check)
  const [{ value: userCount }] = await db.select({ value: count() }).from(users);
  let customerUserId = 1;

  if (userCount === 0) {
    const customerHash = await bcrypt.hash('password123', 10);
    const adminHash = await bcrypt.hash('admin123', 10);

    const insertedUsers = await db
      .insert(users)
      .values([
        { username: 'alex_gamer', passwordHash: customerHash, role: 'CUSTOMER' },
        { username: 'admin_iq', passwordHash: adminHash, role: 'ADMIN' },
      ])
      .returning();

    customerUserId = insertedUsers[0].id;
    console.log('✅ Seeded default users: alex_gamer (CUSTOMER) & admin_iq (ADMIN)');
  }

  // 2. Seed 4 Homepage Banners
  const [{ value: bannerCount }] = await db.select({ value: count() }).from(banners);
  if (bannerCount === 0) {
    await db.insert(banners).values([
      {
        title: 'Roblox Blox Fruits Special Deal — Instant Robux & Godhuman IDs',
        imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80',
        linkUrl: '/topup', sortOrder: 1, isActive: true,
      },
      {
        title: 'RoV Champion League 2025 Top-Up Bonus (+25% Extra Coupons)',
        imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80',
        linkUrl: '/accounts', sortOrder: 2, isActive: true,
      },
      {
        title: 'IQ-Bank PromptPay 0% Fee Weekend — Instant 5-Sec Verification',
        imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80',
        linkUrl: '/topup', sortOrder: 3, isActive: true,
      },
      {
        title: 'Verified Conqueror & Supreme Rank RoV Accounts Restocked',
        imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1600&q=80',
        linkUrl: '/accounts', sortOrder: 4, isActive: true,
      },
    ]);
    console.log('✅ Seeded 4 homepage banners');
  }

  // 3. Seed 6 Game Accounts (matching prototype items)
  const [{ value: accountCount }] = await db.select({ value: count() }).from(gameAccounts);
  let firstAccountId = 1;
  if (accountCount === 0) {
    const insertedAccounts = await db
      .insert(gameAccounts)
      .values([
        {
          gameCategory: 'ROBLOX',
          title: 'Blox Fruits [Max Level 2550 + Godhuman + Perm Kitsune]',
          description: 'Full access Max Level 2550 account with permanent Kitsune fruit, Godhuman fighting style, and clean unlinked email.',
          highlightTags: ['Max Level', 'Godhuman', 'Perm Kitsune', 'Clean Email'],
          price: 450,
          imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
          accountUsername: 'blox_godhuman_99', accountPassword: 'KitsunePass#2024', status: 'AVAILABLE',
        },
        {
          gameCategory: 'ROV',
          title: 'RoV Conqueror Rank [95 Heroes + 140 Skins + Dimension Breaker]',
          description: 'High tier Conqueror account featuring Lauriel & TelAnnas Dimension Breaker skins, full lvl 3 Arcana.',
          highlightTags: ['95 Heroes', '140 Skins', 'Conqueror Rank', 'Verified Clean'],
          price: 890,
          imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
          accountUsername: 'rov_conq_thai', accountPassword: 'ArenaHero#8821', status: 'AVAILABLE',
        },
        {
          gameCategory: 'ROBLOX',
          title: 'Blox Fruits [Cursed Dual Katana + Soul Guitar + Dragon]',
          description: 'Ready for PvP with Cursed Dual Katana (CDK), Soul Guitar, Dragon fruit in inventory, and 30M Beli.',
          highlightTags: ['CDK Unlocked', 'Soul Guitar', 'Dragon Fruit', 'Beli 30M'],
          price: 290,
          imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
          accountUsername: 'cdk_hunter_blox', accountPassword: 'DualSword#1109', status: 'AVAILABLE',
        },
        {
          gameCategory: 'ROV',
          title: "RoV Master Rank [65 Heroes + Tel'Annas Silverwing + Violet EVOS]",
          description: 'Clean Garena ID with rare limited skins and high win-rate stats.',
          highlightTags: ['65 Heroes', '88 Skins', 'Master Rank', 'Instant Handover'],
          price: 380,
          imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80',
          accountUsername: 'rov_master_vip', accountPassword: 'TelAnnas#4433', status: 'AVAILABLE',
        },
        {
          gameCategory: 'ROBLOX',
          title: 'Blox Fruits [Superhuman + True Triple Katana + Buddha]',
          description: 'Awakened Buddha grinding & raid account with True Triple Katana and 15M Beli.',
          highlightTags: ['Buddha Awaken', 'TTK Unlocked', 'Beli 15M'],
          price: 199,
          imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80',
          accountUsername: 'buddha_awakened', accountPassword: 'Buddha#9921', status: 'SOLD',
        },
        {
          gameCategory: 'ROV',
          title: 'RoV Supreme Rank [All Assassins Unlocked + Nakroth Dimension]',
          description: 'Jungle main dream account with Nakroth Dimension Breaker and all assassin heroes unlocked.',
          highlightTags: ['Nakroth DB', 'All Assassins', 'Supreme Rank', 'Safe ID'],
          price: 1250,
          imageUrl: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=600&q=80',
          accountUsername: 'nakroth_king_th', accountPassword: 'JunglePro#5566', status: 'AVAILABLE',
        },
      ])
      .returning();

    firstAccountId = insertedAccounts[4]?.id || insertedAccounts[0].id;
    console.log('✅ Seeded 6 Roblox & RoV marketplace accounts');
  }

  // 4. Seed 3 Top-Up Games & Packages
  const [{ value: gameCount }] = await db.select({ value: count() }).from(topupGames);
  if (gameCount === 0) {
    const insertedGames = await db
      .insert(topupGames)
      .values([
        { slug: 'rov', name: 'Arena of Valor (RoV)', inputMode: 'UID', isActive: true },
        { slug: 'freefire', name: 'Free Fire', inputMode: 'UID', isActive: true },
        { slug: 'roblox', name: 'Roblox Robux', inputMode: 'ID_PASS', isActive: true },
      ])
      .returning();

    const rovGame = insertedGames.find((g) => g.slug === 'rov')!;
    const ffGame = insertedGames.find((g) => g.slug === 'freefire')!;
    const rbxGame = insertedGames.find((g) => g.slug === 'roblox')!;

    const insertedPackages = await db
      .insert(topupPackages)
      .values([
        { gameId: rovGame.id, packageName: '35 Coupons', bonusTag: 'Standard Delivery', price: 10, isActive: true },
        { gameId: rovGame.id, packageName: '110 Coupons', bonusTag: '+5 Bonus', price: 30, isActive: true },
        { gameId: rovGame.id, packageName: '350 Coupons', bonusTag: '+25 Bonus', price: 95, isActive: true },
        { gameId: rovGame.id, packageName: '700 Coupons', bonusTag: '+65 Bonus', price: 190, isActive: true },
        { gameId: rovGame.id, packageName: '1,420 Coupons', bonusTag: '+150 Bonus', price: 380, isActive: true },
        { gameId: rovGame.id, packageName: '3,650 Coupons', bonusTag: '+450 Bonus', price: 950, isActive: true },
        { gameId: ffGame.id, packageName: '100 Diamonds', bonusTag: 'Instant UID', price: 30, isActive: true },
        { gameId: ffGame.id, packageName: '310 Diamonds', bonusTag: '+25 Bonus', price: 90, isActive: true },
        { gameId: ffGame.id, packageName: '520 Diamonds', bonusTag: '+50 Bonus', price: 150, isActive: true },
        { gameId: ffGame.id, packageName: '1,060 Diamonds', bonusTag: '+120 Bonus', price: 300, isActive: true },
        { gameId: ffGame.id, packageName: '2,180 Diamonds', bonusTag: '+300 Bonus', price: 600, isActive: true },
        { gameId: ffGame.id, packageName: '5,600 Diamonds', bonusTag: '+800 Bonus', price: 1500, isActive: true },
        { gameId: rbxGame.id, packageName: '400 Robux', bonusTag: 'Direct Clean', price: 150, isActive: true },
        { gameId: rbxGame.id, packageName: '800 Robux', bonusTag: 'Most Popular', price: 290, isActive: true },
        { gameId: rbxGame.id, packageName: '1,700 Robux', bonusTag: 'Best Value', price: 580, isActive: true },
        { gameId: rbxGame.id, packageName: '4,500 Robux', bonusTag: 'High Tier', price: 1450, isActive: true },
        { gameId: rbxGame.id, packageName: '10,000 Robux', bonusTag: 'Bulk VIP', price: 3200, isActive: true },
      ])
      .returning();

    const sampleOrd = await db
      .insert(orders)
      .values([
        {
          orderNumber: 'ORD-20261014-001', userId: customerUserId, orderType: 'ACCOUNT',
          gameAccountId: firstAccountId, totalAmount: 199, status: 'PAID', fulfillmentStatus: 'COMPLETED',
        },
        {
          orderNumber: 'ORD-20261014-002', userId: customerUserId, orderType: 'TOPUP',
          topupPackageId: insertedPackages[2].id, targetMetadata: { playerUid: '9842109841' },
          totalAmount: 95, status: 'PAID', fulfillmentStatus: 'COMPLETED',
        },
      ])
      .returning();

    await db.insert(payments).values([
      {
        orderId: sampleOrd[0].id, transactionRef: 'IQB-TX-994821', provider: 'IQ_BANK', amount: 199,
        qrPayload: '00020101021229370016A000000677010111011300668000000005802TH53037645406199.0062170513IQB-TX-9948216304ABCD',
        status: 'SUCCESS',
        rawWebhookPayload: { event: 'payment.verified', transactionRef: 'IQB-TX-994821', amount: 199, status: 'SUCCESS' },
        paidAt: new Date(),
      },
      {
        orderId: sampleOrd[1].id, transactionRef: 'IQB-TX-882194', provider: 'IQ_BANK', amount: 95,
        qrPayload: '00020101021229370016A000000677010111011300668000000005802TH5303764540595.0062170513IQB-TX-8821946304EF01',
        status: 'SUCCESS',
        rawWebhookPayload: { event: 'payment.verified', transactionRef: 'IQB-TX-882194', amount: 95, status: 'SUCCESS' },
        paidAt: new Date(),
      },
    ]);
    console.log('✅ Seeded 3 top-up games, 17 denomination packages, and sample orders');
  }

  console.log('🎉 Database seed completed successfully!');
}

seed()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
