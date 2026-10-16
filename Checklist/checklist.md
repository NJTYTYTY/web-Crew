# Project Verification & Acceptance Checklist

## Overview
This document enforces a two-tier Definition of Done (DoD) verification process across the NEXUS PLAY project.
All automated pre-flight checks (Step 1) must execute and pass with zero failures before submitting for manual user verification (Step 2).

---

### Task: Multi-Layer Defect Resolution, Race-Condition Locking & Payment Flow Sync
- Date: 2026-10-17
- Scope: Backend routes (`admin.routes.ts`, `orders.routes.ts`, `webhook.routes.ts`), Storefront (`StoreContext.tsx`, `PaymentCheckoutModal.tsx`, `SimulatorView.tsx`, `HomeView.tsx`, `api.ts`), and Admin Backoffice (`TransactionInspectorDrawer.tsx`, `orders/page.tsx`, `topup/page.tsx`, `page.tsx`).

#### Step 1: AI Automated Verification (Pre-Flight) - PASSED
- [x] TypeScript Static Compilation (Backend): `npx tsc --noEmit` executed in `/backend` - Result: 0 errors.
- [x] TypeScript Static Compilation (Frontend): `npx tsc --noEmit` executed in `/frontend` - Result: 0 errors.
- [x] Automated Test Suite Execution: `npm run test:verify` (`backend/scripts/verify-fixes.ts`) executed against live PostgreSQL - Result: 18/18 tests passed.
  - [x] Test 1.1: Webhook HMAC-SHA256 signature verification with raw buffer succeeds.
  - [x] Test 1.2: Invalid signature rejected with status 401.
  - [x] Test 1.3: Mismatched length signature rejected safely without throwing Buffer length errors.
  - [x] Test 1.4: Missing signature rejected.
  - [x] Test 2.1: Empty update payload detected to protect Drizzle ORM query builder from empty .set() crash.
  - [x] Test 2.2: Partial account update schema validation succeeds with valid fields.
  - [x] Test 2.3: Invalid order status rejected by Zod schema.
  - [x] Test 3.1: Game account created with status AVAILABLE.
  - [x] Test 3.2: First checkout request atomically reserves account with `status = 'RESERVED' WHERE status = 'AVAILABLE'`.
  - [x] Test 3.3: Concurrent second checkout request blocked (0 rows updated), returning 409 Conflict.
  - [x] Test 3.4: Test account cleaned up cleanly.
  - [x] Test 4.1: Order status updated to PAID synchronizes linked game account status to SOLD.
  - [x] Test 4.2: Order status updated to PAID synchronizes linked payment status to SUCCESS.
  - [x] Test 4.3: Order status updated to PAID records paidAt timestamp in database.
  - [x] Test 4.4: Order status updated to CANCELLED restores linked game account status to AVAILABLE.
  - [x] Test 4.5: Order status updated to CANCELLED transitions linked payment status to FAILED.
  - [x] Test 4.6: Test sync records cleaned up cleanly.
  - [x] Test 5.1: pendingTopups KPI calculation filters strictly `orderType === 'TOPUP'` and non-cancelled/non-completed orders.
- [x] Modularity Standard: All modified files verified strictly under 800 lines (max file size: 431 lines).

---

#### Step 2: User Verification Steps (Acceptance Test)

##### 1. Payment Dynamic PromptPay QR Rendering & Download
1. Open the storefront at `http://localhost:3000/topup` or `http://localhost:3000/accounts`.
2. Select any product and click to initiate checkout.
3. Observe the PromptPay QR checkout modal:
   - Dynamic QR code is generated and rendered crisp onto the screen using the `qrcode` library.
   - Click "Download / Save QR" button and observe browser downloading `PromptPay-QR-IQB-TX-XXXXXX.png`.
   - Wait or test the 00:00 countdown state to verify the expiration screen with "Close & Retry".

##### 2. IQ-Bank Webhook Payment Simulator
1. In the QR checkout modal, click "Open IQ-Bank Demo Payment Simulator".
2. On `/iq-bank-simulator`:
   - Click on the pending orders list pill to load the active transaction reference.
   - Click "Confirm Payment & Dispatch Webhook".
   - Return to the storefront tab and verify the modal immediately advances to "Payment Verified" and then "Instant Order Delivery".

##### 3. Admin Backoffice Order Management & Data Synchronization
1. Navigate to `/admin/login` and log in with operator credentials (`admin_iq` / `admin123`).
2. Navigate to `/admin/orders`:
   - Verify client-side pagination (10 items per page) with Previous, page numbers, and Next buttons.
   - Click "Export Logs" and verify browser downloads `IQ-Bank-Audit-Logs.csv` with full ledger records.
   - Inspect any pending order and click "Mark Completed" or "Force Manual Resolve".
   - Verify the linked payment status updates to `SUCCESS` and game account status updates to `SOLD` in PostgreSQL.
3. Navigate to `/admin` (Overview Command):
   - Click "Export CSV" on the Recent Transactions table and verify browser downloads `NexusPlay-Ledger.csv`.
   - Click on any transaction row and verify "Force Manual Resolve / Complete in DB" executes via authorized API request without 401 errors.
4. Navigate to `/admin/topup`:
   - Click "+ Add Package".
   - Select game and fill in denomination and price.
   - Save and verify package links dynamically to the database game ID (`dbGameId`) rather than hardcoded index numbers.

---

#### Acceptance Sign-off
- Status: [x] Step 1 Automated Tests Passed (18/18) | [ ] Pending User Verification Step 2
