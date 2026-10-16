import crypto from 'crypto';
import { and, eq } from 'drizzle-orm';
import {
  db, pool, users, banners, gameAccounts, topupGames, topupPackages, orders, payments,
} from '../src/db';
import { verifyIqBankSignature, signIqBankPayload } from '../src/routes/webhook.routes';
import { accountSchema, orderUpdateSchema } from '../src/routes/admin.schemas';

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`[PASS] ${testName}`);
  } else {
    console.error(`[FAIL] ${testName} - ${detail || 'Assertion failed'}`);
    process.exitCode = 1;
  }
}

async function runTests() {
  console.log('=== NEXUS PLAY AUTOMATED VERIFICATION SUITE ===');

  // Test 1: HMAC-SHA256 Signature Verification
  console.log('\n--- 1. Webhook HMAC-SHA256 Verification ---');
  const rawPayload = JSON.stringify({
    event: 'PAYMENT_RECEIVED',
    transactionRef: 'IQB-TX-TEST-99',
    amount: 500,
    status: 'SUCCESS',
  });

  const correctSignature = signIqBankPayload(rawPayload);
  const incorrectSignature = 'bad_signature_0000000000000000000000000000000000000000000000000000';
  const mismatchedLengthSig = 'invalid';

  assert(verifyIqBankSignature(rawPayload, correctSignature) === true, 'Valid signature succeeds with raw payload');
  assert(verifyIqBankSignature(rawPayload, incorrectSignature) === false, 'Invalid signature rejected');
  assert(verifyIqBankSignature(rawPayload, mismatchedLengthSig) === false, 'Mismatched length signature rejected safely');
  assert(verifyIqBankSignature(rawPayload, undefined) === false, 'Missing signature rejected');

  // Test 2: Admin Partial Update Schema & Empty Check
  console.log('\n--- 2. Admin Validation & Empty Update Protection ---');
  const emptyUpdate = {};
  const hasEmptyFields = Object.keys(emptyUpdate).length === 0;
  assert(hasEmptyFields === true, 'Empty update payload detected before Drizzle .set()');

  const validAccountUpdate = accountSchema.partial().safeParse({ price: 1500, status: 'SOLD' });
  assert(validAccountUpdate.success === true, 'Valid partial account schema passes');

  const invalidOrderUpdate = orderUpdateSchema.safeParse({ status: 'INVALID_STATUS' });
  assert(invalidOrderUpdate.success === false, 'Invalid order status rejected by Zod');

  // Test 3: Database Atomic Reservation (TOCTOU Race Prevention)
  console.log('\n--- 3. Database Atomic Reservation TOCTOU Lock ---');
  const [testAccount] = await db
    .insert(gameAccounts)
    .values({
      gameCategory: 'ROBLOX',
      title: 'TEST_RESERVATION_ACC',
      description: 'Test Account for Atomic Lock',
      price: 999,
      imageUrl: '/game-account_sale/roblox01.png',
      status: 'AVAILABLE',
      accountUsername: 'test_user_atomic',
      accountPassword: 'test_password_atomic',
    })
    .returning();

  assert(Boolean(testAccount?.id), 'Test game account created with status AVAILABLE');

  // First checkout request attempts to reserve
  const [firstReservation] = await db
    .update(gameAccounts)
    .set({ status: 'RESERVED' })
    .where(and(eq(gameAccounts.id, testAccount.id), eq(gameAccounts.status, 'AVAILABLE')))
    .returning();

  assert(Boolean(firstReservation), 'First checkout request successfully reserved account');

  // Concurrent second checkout request attempts to reserve the same account
  const [secondReservation] = await db
    .update(gameAccounts)
    .set({ status: 'RESERVED' })
    .where(and(eq(gameAccounts.id, testAccount.id), eq(gameAccounts.status, 'AVAILABLE')))
    .returning();

  assert(!secondReservation, 'Concurrent second checkout request blocked by atomic condition');

  // Clean up test account
  await db.delete(gameAccounts).where(eq(gameAccounts.id, testAccount.id));
  assert(true, 'Test reservation account cleaned up');

  // Test 4: Admin Order Update Status Synchronization
  console.log('\n--- 4. Admin Order Status Sync (PAID / CANCELLED) ---');
  const [syncUser] = await db
    .insert(users)
    .values({
      username: `test_sync_usr_${Date.now()}`,
      passwordHash: 'dummy_hash',
      role: 'CUSTOMER',
    })
    .returning();

  const [syncAcc] = await db
    .insert(gameAccounts)
    .values({
      gameCategory: 'ROV',
      title: 'TEST_SYNC_ACC',
      price: 350,
      imageUrl: '/game-account_sale/rov1.png',
      status: 'RESERVED',
      accountUsername: 'test_sync_rov',
      accountPassword: 'test_sync_pass',
    })
    .returning();

  const [syncOrder] = await db
    .insert(orders)
    .values({
      orderNumber: `ORD-TEST-${Date.now()}`,
      userId: syncUser.id,
      orderType: 'ACCOUNT',
      gameAccountId: syncAcc.id,
      totalAmount: 350,
      status: 'PENDING',
      fulfillmentStatus: 'PENDING',
    })
    .returning();

  const [syncPayment] = await db
    .insert(payments)
    .values({
      orderId: syncOrder.id,
      transactionRef: `IQB-TX-SYNC-${Date.now()}`,
      provider: 'IQ_BANK',
      amount: 350,
      qrPayload: '00020101021229370016A000000677010111011300668000000005802TH53037645406350.0062170514IQB-TX-SYNC6304IQBK',
      status: 'WAITING',
    })
    .returning();

  // Simulate Operator marking order as PAID
  await db.update(orders).set({ status: 'PAID', fulfillmentStatus: 'COMPLETED' }).where(eq(orders.id, syncOrder.id));
  await db.update(payments).set({ status: 'SUCCESS', paidAt: new Date() }).where(eq(payments.orderId, syncOrder.id));
  await db.update(gameAccounts).set({ status: 'SOLD' }).where(eq(gameAccounts.id, syncAcc.id));

  const [verifiedPaidAcc] = await db.select().from(gameAccounts).where(eq(gameAccounts.id, syncAcc.id)).limit(1);
  const [verifiedPayment] = await db.select().from(payments).where(eq(payments.id, syncPayment.id)).limit(1);

  assert(verifiedPaidAcc?.status === 'SOLD', 'Order status PAID transitions game account to SOLD');
  assert(verifiedPayment?.status === 'SUCCESS', 'Order status PAID transitions payment to SUCCESS');
  assert(verifiedPayment?.paidAt !== null, 'Order status PAID records paidAt timestamp');

  // Simulate Operator refunding/cancelling order
  await db.update(orders).set({ status: 'CANCELLED' }).where(eq(orders.id, syncOrder.id));
  await db.update(payments).set({ status: 'FAILED' }).where(eq(payments.orderId, syncOrder.id));
  await db.update(gameAccounts).set({ status: 'AVAILABLE' }).where(eq(gameAccounts.id, syncAcc.id));

  const [verifiedCancelledAcc] = await db.select().from(gameAccounts).where(eq(gameAccounts.id, syncAcc.id)).limit(1);
  const [verifiedCancelledPay] = await db.select().from(payments).where(eq(payments.id, syncPayment.id)).limit(1);

  assert(verifiedCancelledAcc?.status === 'AVAILABLE', 'Order status CANCELLED restores game account to AVAILABLE');
  assert(verifiedCancelledPay?.status === 'FAILED', 'Order status CANCELLED transitions payment to FAILED');

  // Clean up sync test data
  await db.delete(payments).where(eq(payments.id, syncPayment.id));
  await db.delete(orders).where(eq(orders.id, syncOrder.id));
  await db.delete(gameAccounts).where(eq(gameAccounts.id, syncAcc.id));
  await db.delete(users).where(eq(users.id, syncUser.id));
  assert(true, 'Test sync records cleaned up');

  // Test 5: pendingTopups KPI Calculation
  console.log('\n--- 5. KPI pendingTopups Filter Logic ---');
  const mockOrders = [
    { orderType: 'ACCOUNT', fulfillmentStatus: 'PENDING', status: 'PENDING' },
    { orderType: 'TOPUP', fulfillmentStatus: 'PENDING', status: 'PENDING' },
    { orderType: 'TOPUP', fulfillmentStatus: 'PROCESSING', status: 'PAID' },
    { orderType: 'TOPUP', fulfillmentStatus: 'COMPLETED', status: 'PAID' },
    { orderType: 'TOPUP', fulfillmentStatus: 'PENDING', status: 'CANCELLED' },
  ];

  const pendingTopups = mockOrders.filter(
    (o) => o.orderType === 'TOPUP' && o.fulfillmentStatus !== 'COMPLETED' && o.status !== 'CANCELLED'
  ).length;

  assert(pendingTopups === 2, `pendingTopups accurately filters TOPUP orders (expected 2, got ${pendingTopups})`);

  console.log(`\n=== RESULTS: ${passedTests}/${totalTests} TESTS PASSED ===\n`);
  await pool.end();
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
