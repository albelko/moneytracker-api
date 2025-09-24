import type { FastifyInstance } from 'fastify';
import client from 'prom-client';

const registry = new client.Registry();

registry.setDefaultLabels({ app: 'moneytracker' });
client.collectDefaultMetrics({ register: registry });

export async function adminRoutes(app: FastifyInstance) {
  app.get('/health', async () => ({ status: 'ok' }));

  app.get('/ready', async () => ({ status: 'ready' }));

  app.get('/metrics', async (req, reply) => {
    reply.header('Content-Type', registry.contentType);
    return registry.metrics();
  });
}
