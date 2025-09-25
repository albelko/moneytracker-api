import type { FastifyInstance } from 'fastify';
import { adminRoutes } from '@/modules/admin/admin.routes.js';
import transactionsRoutes from '@/modules/transactions/transactions.routes';

export async function registerRoutes(app: FastifyInstance) {
  app.register(adminRoutes, { prefix: '/status' });
  app.register(transactionsRoutes);
}
