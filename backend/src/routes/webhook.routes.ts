import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db, orders, payments, gameAccounts } from '../db';

const router = Router();

export const IQBANK_WEBHOOK_SECRET =
  process.env.IQBANK_WEBHOOK_SECRET || 'iqbank_hmac_sha256_secret_2026';

export function signIqBankPayload(payloadString: string): string {
  return crypto
    .createHmac('sha256', IQBANK_WEBHOOK_SECRET)
    .update(payloadString)
    .digest('hex');
}

export function verifyIqBankSignature(payloadString: string, signature?: string): boolean {
  if (!signature) return false;
  const expected = signIqBankPayload(payloadString);
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return false;
  return crypto.timingSafeEqual(sigBuf, expBuf);
}

const webhookBodySchema = z.object({
  event: z.string().optional(),
  transactionRef: z.string().min(1, 'transactionRef is required'),
  status: z.enum(['SUCCESS', 'FAILED']),
  amount: z.coerce.number().optional(),
  timestamp: z.string().optional(),
});

async function processVerifiedWebhook(
  payload: z.infer<typeof webhookBodySchema>,
  rawPayload: Record<string, unknown>
) {
  const { transactionRef, status } = payload;

  const [payment] = await db
    .select()
    .from(payments)
    .where(eq(payments.transactionRef, transactionRef))
    .limit(1);

  if (!payment) {
    return { statusCode: 404, body: { error: `Transaction ${transactionRef} not found` } };
  }

  // Idempotency guard: if already SUCCESS, return 200 without re-executing side effects
  if (payment.status === 'SUCCESS') {
    const [existingOrder] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, payment.orderId))
      .limit(1);

    return {
      statusCode: 200,
      body: {
        success: true,
        idempotent: true,
        message: 'Transaction already processed (idempotent no-op)',
        transactionRef,
        payment,
        order: existingOrder,
      },
    };
  }

  if (status === 'SUCCESS') {
    const [updatedPayment] = await db
      .update(payments)
      .set({
        status: 'SUCCESS',
        paidAt: new Date(),
        rawWebhookPayload: rawPayload,
      })
      .where(eq(payments.id, payment.id))
      .returning();

    const [updatedOrder] = await db
      .update(orders)
      .set({
        status: 'PAID',
        fulfillmentStatus: 'COMPLETED',
      })
      .where(eq(orders.id, payment.orderId))
      .returning();

    if (updatedOrder && updatedOrder.orderType === 'ACCOUNT' && updatedOrder.gameAccountId) {
      await db
        .update(gameAccounts)
        .set({ status: 'SOLD' })
        .where(eq(gameAccounts.id, updatedOrder.gameAccountId));
    }

    return {
      statusCode: 200,
      body: {
        success: true,
        idempotent: false,
        message: 'Payment verified and order fulfilled',
        transactionRef,
        payment: updatedPayment,
        order: updatedOrder,
      },
    };
  } else {
    const [updatedPayment] = await db
      .update(payments)
      .set({
        status: 'FAILED',
        rawWebhookPayload: rawPayload,
      })
      .where(eq(payments.id, payment.id))
      .returning();

    const [updatedOrder] = await db
      .update(orders)
      .set({
        status: 'CANCELLED',
        fulfillmentStatus: 'FAILED',
      })
      .where(eq(orders.id, payment.orderId))
      .returning();

    return {
      statusCode: 200,
      body: {
        success: true,
        idempotent: false,
        message: 'Payment marked as FAILED',
        transactionRef,
        payment: updatedPayment,
        order: updatedOrder,
      },
    };
  }
}

// POST /api/webhooks/iqbank — Official HMAC-SHA256 verified webhook endpoint
router.post('/webhooks/iqbank', async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-iqbank-signature'] as string | undefined;
    const rawString = JSON.stringify(req.body);

    const isValidSig = verifyIqBankSignature(rawString, signature);
    if (!isValidSig) {
      res.status(401).json({
        error: 'Invalid x-iqbank-signature HMAC-SHA256 digest',
      });
      return;
    }

    const parsed = webhookBodySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: parsed.error.issues[0]?.message || 'Invalid webhook payload',
      });
      return;
    }

    const result = await processVerifiedWebhook(parsed.data, {
      ...req.body,
      signatureVerified: true,
      signature,
    });

    res.status(result.statusCode).json(result.body);
  } catch (err) {
    console.error('IQ-Bank webhook error:', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Helper handler for simulator trigger (/api/simulator/trigger and /api/webhooks/iqbank/simulate)
async function handleSimulatorTrigger(req: Request, res: Response) {
  try {
    const parsed = webhookBodySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: parsed.error.issues[0]?.message || 'Invalid simulator trigger request',
      });
      return;
    }

    const webhookPayload = {
      event:
        parsed.data.status === 'SUCCESS' ? 'payment.verified' : 'payment.failed',
      transactionRef: parsed.data.transactionRef,
      amount: parsed.data.amount,
      status: parsed.data.status,
      provider: 'IQ_BANK',
      timestamp: new Date().toISOString(),
    };

    const payloadString = JSON.stringify(webhookPayload);
    const hmacSignature = signIqBankPayload(payloadString);

    // Verify our own HMAC signature before processing
    if (!verifyIqBankSignature(payloadString, hmacSignature)) {
      res.status(500).json({ error: 'Internal HMAC signature verification failed' });
      return;
    }

    const result = await processVerifiedWebhook(parsed.data, {
      ...webhookPayload,
      signature: hmacSignature,
      simulatedVia: 'IQ_BANK_SIMULATOR',
    });

    res.status(result.statusCode).json({
      ...result.body,
      signature: hmacSignature,
      webhookPayload,
    });
  } catch (err) {
    console.error('Simulator trigger error:', err);
    res.status(500).json({ error: 'Simulator trigger failed' });
  }
}

router.post('/simulator/trigger', handleSimulatorTrigger);
router.post('/webhooks/iqbank/simulate', handleSimulatorTrigger);

export default router;
