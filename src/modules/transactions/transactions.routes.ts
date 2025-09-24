import { FastifyPluginAsync } from 'fastify';
import { CreateBody, UpdateBody } from './transactions.schemas';
import { TransactionsRepository } from './transactions.repository';
import { TransactionsService } from './transactions.service';

const transactionsRoutes: FastifyPluginAsync = async (app) => {
  const repo = new TransactionsRepository(app.prisma);
  const svc = new TransactionsService(repo);

  // Temporary hardcoded user id until auth is ready
  const DEMO_USER_ID = '9397a199-2ce2-40ec-a2c8-dd6100adc930';

  // List all transactions
  app.get('/', async (_req, reply) => {
    const list = await svc.list(DEMO_USER_ID);
    return reply.send(list);
  });

  // Get transaction by id
  app.get('/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const tx = await svc.get(DEMO_USER_ID, id);
    return reply.send(tx);
  });

  // Create a new transaction
  app.post('/', async (req, reply) => {
    const body = CreateBody.parse(req.body);
    const created = await svc.create(DEMO_USER_ID, body);
    return reply.code(201).send(created);
  });

  // Update transaction by id
  app.patch('/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const body = UpdateBody.parse(req.body);
    const updated = await svc.update(DEMO_USER_ID, id, body);
    return reply.send(updated);
  });

  // Delete transaction by id
  app.delete('/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    await svc.delete(DEMO_USER_ID, id);
    return reply.code(204).send();
  });
};

export default transactionsRoutes;
