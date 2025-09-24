import { z } from 'zod';

export const TransactionType = z.enum(['EXPENSE', 'INCOME', 'TRANSFER']);

export const TransactionPublic = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  accountId: z.string().uuid(),
  type: TransactionType,
  amount: z.string(),
  currency: z.string().length(3),
  occurredAt: z.string(),
  description: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  categoryId: z.string().uuid().nullable().optional(),
  payeeId: z.string().uuid().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateBody = z.object({
  accountId: z.string().uuid(),
  type: TransactionType,
  amount: z.number(),
  currency: z.string().length(3),
  occurredAt: z.string().datetime(),
  description: z.string().optional(),
  note: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  payeeId: z.string().uuid().optional(),
});
export type CreateBody = z.infer<typeof CreateBody>;

export const UpdateBody = CreateBody.partial();
export type UpdateBody = z.infer<typeof UpdateBody>;
