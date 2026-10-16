import { z } from 'zod';

export const accountSchema = z.object({
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

export const packageSchema = z.object({
  gameId: z.coerce.number().int().positive(),
  packageName: z.string().min(1),
  bonusTag: z.string().optional().nullable(),
  price: z.coerce.number().int().positive('Price must be greater than 0'),
  isActive: z.boolean().default(true),
});

export const gameUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  iconUrl: z.string().min(1).optional(),
  inputMode: z.enum(['UID', 'ID_PASS']).optional(),
  isActive: z.boolean().optional(),
});

export const bannerSchema = z.object({
  title: z.string().min(1),
  imageUrl: z.string().min(1),
  linkUrl: z.string().optional().nullable(),
  sortOrder: z.coerce.number().int().default(1),
  isActive: z.boolean().default(true),
});

export const orderUpdateSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'CANCELLED']).optional(),
  fulfillmentStatus: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']).optional(),
});
