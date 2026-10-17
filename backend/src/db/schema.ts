import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['CUSTOMER', 'ADMIN']);
export const gameCategoryEnum = pgEnum('game_category', ['ROBLOX', 'ROV']);
export const accountStatusEnum = pgEnum('account_status', ['AVAILABLE', 'RESERVED', 'SOLD']);
export const topupInputModeEnum = pgEnum('topup_input_mode', ['UID', 'ID_PASS']);
export const orderTypeEnum = pgEnum('order_type', ['ACCOUNT', 'TOPUP']);
export const orderStatusEnum = pgEnum('order_status', ['PENDING', 'PAID', 'CANCELLED']);
export const fulfillmentStatusEnum = pgEnum('fulfillment_status', ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']);
export const paymentStatusEnum = pgEnum('payment_status', ['WAITING', 'SUCCESS', 'FAILED']);

// 1. Users Table (Username & Password Only)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 64 }).unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  role: userRoleEnum('role').default('CUSTOMER').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 2. Homepage Banners Table
export const banners = pgTable('banners', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  imageUrl: text('image_url').notNull(),
  linkUrl: text('link_url'),
  sortOrder: integer('sort_order').default(1).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 3. Game Accounts Marketplace Table (Roblox & RoV)
export const gameAccounts = pgTable('game_accounts', {
  id: serial('id').primaryKey(),
  gameCategory: varchar('game_category', { length: 50 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  highlightTags: jsonb('highlight_tags').$type<string[]>().default([]).notNull(),
  specs: jsonb('specs').$type<{
    levelOrRank?: string;
    heroesOrFruitsCount?: string;
    skinsOrWeaponsCount?: string;
    serverRegion?: string;
    emailStatus?: string;
  }>(),
  price: integer('price').notNull(), // Stored in THB
  imageUrl: text('image_url').notNull(),
  // Secret credentials delivered ONLY after order is PAID
  accountUsername: text('account_username').notNull(),
  accountPassword: text('account_password').notNull(),
  status: accountStatusEnum('status').default('AVAILABLE').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 4. Top-Up Games Configuration Table
export const topupGames = pgTable('topup_games', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 50 }).unique().notNull(), // 'rov', 'freefire', 'roblox'
  name: varchar('name', { length: 100 }).notNull(),
  iconUrl: text('icon_url').default('/game-logos/rov/rov-icon.png').notNull(),
  inputMode: topupInputModeEnum('input_mode').notNull(), // 'UID' or 'ID_PASS'
  isActive: boolean('is_active').default(true).notNull(),
});

// 5. Top-Up Packages Table
export const topupPackages = pgTable('topup_packages', {
  id: serial('id').primaryKey(),
  gameId: integer('game_id').references(() => topupGames.id, { onDelete: 'cascade' }).notNull(),
  packageName: varchar('package_name', { length: 150 }).notNull(), // e.g., '350 Coupons', '800 Robux'
  bonusTag: varchar('bonus_tag', { length: 100 }), // e.g., '+50 Bonus'
  price: integer('price').notNull(), // Stored in THB
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 6. Orders Table
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  orderNumber: varchar('order_number', { length: 64 }).unique().notNull(), // e.g., ORD-20261014-001
  userId: integer('user_id').references(() => users.id).notNull(),
  orderType: orderTypeEnum('order_type').notNull(), // 'ACCOUNT' or 'TOPUP'
  gameAccountId: integer('game_account_id').references(() => gameAccounts.id),
  topupPackageId: integer('topup_package_id').references(() => topupPackages.id),
  // Stores UID or { robloxUsername, robloxPassword } for top-ups
  targetMetadata: jsonb('target_metadata').$type<{
    playerUid?: string;
    robloxUsername?: string;
    robloxPassword?: string;
  }>(),
  totalAmount: integer('total_amount').notNull(),
  status: orderStatusEnum('status').default('PENDING').notNull(),
  fulfillmentStatus: fulfillmentStatusEnum('fulfillment_status').default('PENDING').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 7. Payments & Webhook Audit Table
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  transactionRef: varchar('transaction_ref', { length: 100 }).unique().notNull(), // e.g., IQB-TX-994821
  provider: varchar('provider', { length: 50 }).default('IQ_BANK').notNull(),
  amount: integer('amount').notNull(),
  qrPayload: text('qr_payload').notNull(),
  status: paymentStatusEnum('status').default('WAITING').notNull(),
  rawWebhookPayload: jsonb('raw_webhook_payload'),
  paidAt: timestamp('paid_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
