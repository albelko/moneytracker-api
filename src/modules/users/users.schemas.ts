import { z } from 'zod';

export const meResponse = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().nullable().optional(),
  role: z.enum(['USER', 'ADMIN']),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type MeResponse = z.infer<typeof meResponse>;

export const mePatchBody = z.object({
  name: z.string().min(1).max(100).optional(),
  // TODO: добавить defaultCurrency, timezone, когда появятся в Prisma-схеме
});
export type MePatchBody = z.infer<typeof mePatchBody>;

export const securityResponse = z.object({
  twoFactorEnabled: z.boolean(),
  sessions: z.array(
    z.object({
      // id/ua/ip/lastSeenAt...
    })
  ),
  tokens: z.array(z.object({})), // Заглушка под API-токены/устройства
});
export type SecurityResponse = z.infer<typeof securityResponse>;
