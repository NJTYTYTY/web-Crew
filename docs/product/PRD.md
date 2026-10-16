# Product Requirements Document (PRD)
## Project Name: Gaming E-Commerce & Automated Game Top-Up Platform (with IQ-Bank Dynamic QR Webhook Architecture)

---

## 0. CRITICAL DIRECTIVE FOR DEVELOPER / AI CODING AGENT
> **IMPORTANT — INSPECT LOCAL `.html` UI REFERENCES FIRST:**
> All UI prototype `.html` files for both the **Storefront** (Customer UI + IQ-Bank Payment Modal + IQ-Bank Simulator) and the **Admin Backoffice** have already been placed inside this workspace directory (`/Documents/web-port/cedt-crew`).
>
> **Before writing any Frontend code, you MUST:**
> 1. Deep-dive and scan all `.html` files located in this directory.
> 2. Extract the exact DOM structures, Tailwind CSS class names, color tokens (**Clean Minimal Light Theme**), typography, layouts, and interactive states from those `.html` files.
> 3. Convert the static `.html` designs faithfully into modular **Next.js (App Router) + TypeScript + Tailwind CSS** components and pages while wiring them up to the real **Express.js + Drizzle ORM + PostgreSQL** backend specified in this PRD.

---

## 1. Project Overview
This project is a full-stack Gaming E-Commerce & Automated Game Top-Up Platform built as a university software engineering project with production-grade payment architecture. 

The platform serves two primary business flows:
1. **Game Account Marketplace:** Selling ready-to-play **Roblox** and **RoV** accounts with automated credential (`username` & `password`) delivery immediately upon payment verification.
2. **Automated Game Top-Up Service:** Supporting **RoV** and **Free Fire** (via Player UID) and **Roblox** (via Username & Password) with selectable top-up denominations.

To replicate real-world corporate banking flows (modeled after **KBank Business Open API / Dynamic QR PromptPay**) without requiring real money transfers during demonstrations, the system integrates a custom mock banking service called **IQ-Bank**. It implements an asynchronous **Webhook/Callback architecture**, **HMAC-SHA256 signature verification**, **idempotency protection**, and **real-time frontend auto-detection** via polling or Server-Sent Events (SSE).

---

## 2. Tech Stack & Infrastructure

### 2.1 Frontend (`/frontend`)
- **Framework:** Next.js (App Router) with TypeScript
- **Styling:** Tailwind CSS (Clean Minimal Light Theme extracted from the local `.html` files)
- **Icons:** Lucide React (`lucide-react`)
- **QR Code Generation/Display:** `qrcode` / `next/image`
- **State & Fetching:** React Hooks + Native `fetch` / Polling (`setInterval`) or `EventSource` (SSE) for payment auto-detection

### 2.2 Backend (`/backend`)
- **Runtime & Framework:** Node.js + Express.js with TypeScript
- **Authentication:** Custom Username + Password authentication using `bcrypt` (password hashing) and `jsonwebtoken` (JWT via HTTP-only cookies or Bearer token)
- **Security & Validation:** `zod` (request validation), Node `crypto` (HMAC-SHA256 webhook signature verification), `cors`

### 2.3 Database & ORM
- **Database:** PostgreSQL 16
- **ORM:** Drizzle ORM (`drizzle-orm`, `postgres` / `pg`)
- **Migrations & Schema Management:** Drizzle Kit (`drizzle-kit`)

### 2.4 DevOps & Deployment
- **Containerization:** Docker (`Dockerfile` for `/frontend` and `/backend`)
- **Orchestration:** `docker-compose.yml` running `postgres`, `backend`, and `frontend` in an isolated bridge network with persistent volumes.

---

## 3. Visual Theme & UI/UX Specifications (From Local `.html` Files)
- **Theme Style:** Clean Minimal Light Theme (Shadcn UI Light / Apple / Stripe inspired).
- **Color Palette:**
  - Backgrounds: Pure white (`#ffffff`) and soft off-white (`#f8fafc`).
  - Cards & Surfaces: White (`#ffffff`) with subtle borders (`border-slate-200`) and soft shadows (`shadow-sm`).
  - Typography: High-contrast slate (`text-slate-900`, `text-slate-600`).
  - Accents: Royal Indigo (`#4f46e5`) for primary actions and Emerald (`#10b981`) for payment verification & stock badges.
- **Currency:** Thai Baht (`฿` / `THB`).

---

## 4. Functional Requirements & User Flows

### 4.1 Customer Authentication (`/login`, `/register`)
- **Strict Requirement:** Authenticate using **ONLY `username` and `password`** (plus `confirmPassword` on registration).
- Do NOT include email fields, phone numbers, "Forgot Password", or OAuth/Social login buttons.
- Authenticated users can purchase items and view their order history and delivered game account credentials in `/orders`.

### 4.2 Storefront — Home & Navigation (`/`)
- **Hero Banner Carousel:** Dynamic promotional banner slider fetched from the backend (`GET /api/banners`), showing only active banners ordered by `sortOrder`.
- **Service Navigation:** Quick access to the **Game Account Marketplace** (`1.1`) and **Automated Game Top-Up** (`1.2`).

### 4.3 Storefront Module 1.1 — Game Account Marketplace (`/accounts`)
- **Supported Games:** `Roblox` and `RoV`.
- **Filtering:** Filter by game category (`ALL`, `ROBLOX`, `ROV`), sort by price, and filter by availability (`AVAILABLE` vs `SOLD`).
- **Product Card:** Displays game badge, thumbnail, title, highlight spec tags (e.g., `"Max Level"`, `"Godhuman"`, `"Conqueror Rank"`), price (`฿`), and stock status.
- **Instant Delivery Logic:** Secret account credentials (`accountUsername` and `accountPassword`) are stored in PostgreSQL and **NEVER** exposed in public product APIs. They are only returned to the buyer after the order status transitions to `PAID`.

### 4.4 Storefront Module 1.2 — Automated Game Top-Up (`/topup`)
- **Game Selector Tabs:** Switch between **RoV**, **Free Fire**, and **Roblox**.
- **Dynamic Input Form:**
  - **UID Mode (`RoV` & `Free Fire`):**
    - Requires `Player UID` input.
    - Displays selectable package grid (e.g., Coupons for RoV, Diamonds for Free Fire).
  - **ID-Pass Mode (`Roblox`):**
    - Requires `Roblox Username` and `Roblox Password` inputs.
    - Displays a prominent warning advising the customer to disable 2-Step Verification (2FA) prior to ordering.
    - Displays selectable Robux package grid (`400 R$`, `800 R$`, `1,700 R$`, etc.).

### 4.5 IQ-Bank Dynamic QR Payment Popup & Auto-Detect Flow
When a customer clicks **"Buy Account"** or **"Confirm & Pay"**:
1. Frontend sends `POST /api/orders` with the selected item/package ID and required top-up inputs (NEVER trusting client-side price).
2. Backend calculates the exact price from PostgreSQL, creates an `orders` record (`PENDING`) and a `payments` record (`WAITING`) with a unique `transactionRef` (e.g., `IQB-TX-994821`), and returns a Dynamic QR payload/URL.
3. The **Checkout Payment Modal** opens on the Storefront with **3 States**:
   - **State 1: Waiting for Payment:** Shows Order ID, `transactionRef`, total amount (`฿`), generated **IQ-Bank Dynamic QR Code**, countdown timer, and a live polling indicator (`"Waiting for payment... Auto-detecting transaction from IQ-Bank"`). Includes a helper link/button to open `/iq-bank-simulator`.
   - **State 2: Payment Autodetected (Success):** Frontend polls `GET /api/orders/:id/status` every 2 seconds (or listens via SSE). As soon as the backend processes the IQ-Bank webhook and updates the order to `PAID`, the modal automatically transitions to the verified state without page reload.
   - **State 3: Order Fulfillment View:**
     - For **Game Accounts**: Reveals the purchased `Account Username` and `Account Password` with one-click copy buttons.
     - For **Game Top-Ups**: Shows live fulfillment progress (`Payment Received` -> `Delivering to UID/Account` -> `Completed`).

### 4.6 IQ-Bank Demo Payment Simulator (`/iq-bank-simulator`)
A standalone mock banking web interface built into the project to demonstrate the webhook flow during presentations:
- Allows uploading/dropping a captured QR code image (or clicking a `"Simulate QR Upload"` / auto-filling via query param `?ref=IQB-TX-...`).
- Parses and displays Merchant Name, `transactionRef`, Target Account (`IQ-Bank Business`), and exact Amount (`฿`).
- **Action Buttons:**
  - **`[Confirm Payment (Trigger Webhook)]`**: Calls the simulator backend endpoint which signs the payload with `HMAC-SHA256` and dispatches an HTTP POST webhook to `POST /api/webhooks/iqbank`.
  - **`[Simulate Failed Payment]`**: Dispatches a failed webhook event to test error handling.

### 4.7 Admin Backoffice (`/admin/login` & `/admin/*`) — NEXUS PLAY Precision Slate
- **Branding & Visual Identity:** Branded as **NEXUS PLAY** featuring the official logo (`/logopic.webp`) and dark Precision Slate design system across all backoffice screens.
- **Strict Route Guard & Access Control (`/admin/(dashboard)/layout.tsx`):**
  - All `/admin/*` routes (except `/admin/login`) are protected by a client-side route guard checking `getAdminSession()`.
  - Direct URL access without an active `ADMIN` session immediately aborts rendering and redirects to `/admin/login`.
  - Non-admin users (`CUSTOMER` role) attempting to sign in on `/admin/login` are rejected with an explicit security alert.
  - Admin authentication state is isolated from customer storefront sessions using dedicated storage keys (`nexus_play_admin_user` and `nexus_play_admin_token`).
  - One-click Sign Out in `AdminSidebar` and `AdminHeader` clears the admin session and returns the user to `/admin/login`.
- **Admin Login (`/admin/login`):** Restricted login page (`Username` and `Password` only) requiring credentials of an account with `role === 'ADMIN'` (e.g. seeded account `admin_iq` / `admin123`).
- **Dashboard Overview (`/admin`):** Displays dynamic KPI cards (Total Revenue `฿`, Game Accounts Sold, Pending Top-Up Orders, Active Banners) and a Recent Transactions table with live IQ-Bank webhook statuses.
- **Module 1 — Game Accounts CRUD (`/admin/accounts`):** Create, read, update, and delete Roblox/RoV accounts, including managing the secret `accountUsername` and `accountPassword` fields and stock status (`AVAILABLE` / `SOLD`).
- **Module 2 — Top-Up Games & Packages CRUD (`/admin/topup`):** Manage supported games (`RoV`, `Free Fire`, `Roblox`), input modes (`UID` vs `ID_PASS`), and CRUD operations for package denominations, prices, bonus tags, and active states.
- **Module 3 — Orders, Top-Up Queue & Webhook Logs (`/admin/orders`):** Inspect all orders, view live IQ-Bank webhook logs in the gateway audit terminal, inspect raw webhook JSON payloads, copy customer-submitted UIDs or Roblox credentials, and update fulfillment status (`PENDING` -> `PROCESSING` -> `COMPLETED` / `FAILED`).
- **Module 4 — Homepage Banner CRUD (`/admin/banners`):** Add, edit, delete, reorder (`sortOrder`), and toggle active/inactive status for homepage hero banners.

---

## 5. Database Schema Specification (Drizzle ORM + PostgreSQL)

Implement the following schema in `/backend/src/db/schema.ts`:

```typescript
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
  gameCategory: gameCategoryEnum('game_category').notNull(),
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