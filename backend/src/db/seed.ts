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
        imageUrl: '/pic-banner-slide/roblox.webp',
        linkUrl: '/topup', sortOrder: 1, isActive: true,
      },
      {
        title: 'RoV Champion League 2025 Top-Up Bonus (+25% Extra Coupons)',
        imageUrl: '/pic-banner-slide/rov.jpeg',
        linkUrl: '/accounts', sortOrder: 2, isActive: true,
      },
      {
        title: 'Free Fire Instant UID Diamonds — 5-Second Auto Delivery',
        imageUrl: '/pic-banner-slide/freefire.jpeg',
        linkUrl: '/topup', sortOrder: 3, isActive: true,
      },
      {
        title: 'Verified Roblox & RoV Accounts — 100% Clean Handover',
        imageUrl: '/pic-banner-slide/roblox.jpeg',
        linkUrl: '/accounts', sortOrder: 4, isActive: true,
      },
    ]);
    console.log('✅ Seeded 4 homepage banners');
  }

  // 3. Seed 6 Game Accounts (matching /game-account_sale/* screenshots)
  const [{ value: accountCount }] = await db.select({ value: count() }).from(gameAccounts);
  let firstAccountId = 1;
  if (accountCount === 0) {
    const insertedAccounts = await db
      .insert(gameAccounts)
      .values([
        {
          gameCategory: 'ROBLOX',
          title: 'Blox Fruits [Lv.2550 MAX + Human V4 T10 + CDK + Awakened Ice/Dark]',
          description: 'Clean Blox Fruits Max Level 2550 account (ID 6214) with Human V4 Tier 10, all 6 fighting styles mastered (Godhuman, Dragon Talon, E-Claw, Sharkman, Death Step, Superhuman), Cursed Dual Katana (CDK), Spikey Trident, Awakened Ice & Dark fruits, Spirit & Buddha in inventory, $481,731 Beli, and ƒ141,389 Fragments.',
          highlightTags: ['Human V4 T10', 'CDK + 6 Melee', 'ƒ141,389 Frag', 'Clean ID'],
          price: 450,
          imageUrl: '/game-account_sale/roblox01.png',
          accountUsername: 'blox_id6214_v4', accountPassword: 'HumanV4#6214', status: 'AVAILABLE',
        },
        {
          gameCategory: 'ROV',
          title: 'RoV Ex-Supreme [108 Heroes + 194 Skins + Lauriel Mythical & Airi Ultimate]',
          description: 'Former Supreme rank RoV account with 108 Heroes and 194 Skins (5,623 matches played, 57.4% win rate, 98 credibility score). Includes Lauriel The Phoenix (Mythical), Airi Sakura Fubuki (Ultimate), Krixi Witchs Creed (Halloween), and TelAnnas Petal of Dream (VIP).',
          highlightTags: ['108 Heroes', '194 Skins', 'Ex-Supreme', '57.4% Winrate'],
          price: 2500,
          imageUrl: '/game-account_sale/rov1.png',
          accountUsername: 'rov_supreme_194', accountPassword: 'Lauriel#2500', status: 'AVAILABLE',
        },
        {
          gameCategory: 'ROBLOX',
          title: 'Blox Fruits [Lv.2800 + Cyborg V4 T10 + 7 Melee Sanguine + Kitsune & CDK]',
          description: 'High-end Lv. 2800 Blox Fruits PvP account featuring Cyborg V4 Full Gear (T10), all 7 Fighting Styles unlocked including Sanguine Art & Godhuman, Kitsune equipped, Cursed Dual Katana (CDK), Hallow Scythe, $7.16M Beli, and ƒ35,307 Fragments.',
          highlightTags: ['Cyborg V4 T10', '7 Melee + Kitsune', 'Hallow Scythe + CDK', 'Clean ID'],
          price: 590,
          imageUrl: '/game-account_sale/roblox02.png',
          accountUsername: 'cyborg_v4_kitsune', accountPassword: 'Sanguine#2800', status: 'AVAILABLE',
        },
        {
          gameCategory: 'ROV',
          title: 'RoV Ex-Supreme [127 Heroes + 300 Skins + 2 Mythical & 2 Esteem Skins]',
          description: 'Collector-tier Ex-Supreme RoV account with 127 Heroes and 300 Skins (12,624 matches, 52.3% win rate, 100 credibility). Features 2 Mythical skins (Lauriel The Phoenix, TelAnnas F.E.E-X1 Silverwing), 2 Esteem skins (Liliana Mirage, Violet Golden Dragon), and 2 Ultimate skins.',
          highlightTags: ['127 Heroes', '300 Skins', '2 Mythical + 2 Esteem', 'Ex-Supreme'],
          price: 3500,
          imageUrl: '/game-account_sale/rov2.png',
          accountUsername: 'rov_collector_300', accountPassword: 'Silverwing#3500', status: 'AVAILABLE',
        },
        {
          gameCategory: 'ROBLOX',
          title: 'Blox Fruits [Fruit Notifier 2700R$ + 2x Mastery + 2x Money Gamepasses]',
          description: 'Rare Gamepass-loaded Blox Fruits account (Lv. 1115) owning Permanent Fruit Notifier (worth 2,700 Robux), 2x Mastery (450 Robux), and 2x Money (450 Robux). Equipped with Rumble fruit, Saber sword (Mastery 438), and $463,749 Beli.',
          highlightTags: ['Fruit Notifier', '2x Mastery', '2x Money', 'Rumble + Saber'],
          price: 650,
          imageUrl: '/game-account_sale/roblox03.png',
          accountUsername: 'neheel23456', accountPassword: 'Notifier#2700', status: 'AVAILABLE',
        },
        {
          gameCategory: 'ROV',
          title: 'RoV Collector [125 Heroes + 281 Skins + Airi & Nakroth Miracle Skins]',
          description: 'Stacked RoV collector account with 125 Heroes and 281 Skins (5,334 matches, 52.9% win rate, 96 credibility). Includes 2 Miracle skins (Airi Sakura Fubuki, Nakroth Mechanized Zero), Airi Gold Edition (Esteem), TelAnnas Realm Guardian (Ultimate), and Demon Slayer Inosuke Zephys.',
          highlightTags: ['125 Heroes', '281 Skins', '2 Miracle Skins', 'Inosuke Collab'],
          price: 2800,
          imageUrl: '/game-account_sale/rov3.png',
          accountUsername: 'rov_miracle_281', accountPassword: 'Mechanized#2800', status: 'AVAILABLE',
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
      ]);

    console.log('✅ Seeded 3 top-up games and 17 denomination packages');
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
