import { FastifyPluginAsync } from 'fastify';
import { CreateBody, UpdateBody } from './transactions.schemas';
import { TransactionsRepository } from './transactions.repository';
import { TransactionsService } from './transactions.service';

const transactionsRoutes: FastifyPluginAsync = async (app) => {
  const repo = new TransactionsRepository(app.prisma);
  const svc = new TransactionsService(repo);

  app.get('/users/:userId/transactions', async (req, reply) => {
    const { userId } = req.params as { userId: string };
    const list = await svc.list(userId);
    return reply.send(list);
  });

  app.get('/users/:userId/transactions/:id', async (req, reply) => {
    const { userId, id } = req.params as { userId: string; id: string };
    const tx = await svc.get(userId, id);
    return reply.send(tx);
  });

  app.post('/users/:userId/transactions', async (req, reply) => {
    const { userId } = req.params as { userId: string };
    const body = CreateBody.parse(req.body);
    const created = await svc.create(userId, body);
    return reply.code(201).send(created);
  });

  app.patch('/users/:userId/transactions/:id', async (req, reply) => {
    const { userId, id } = req.params as { userId: string; id: string };
    const body = UpdateBody.parse(req.body);
    const updated = await svc.update(userId, id, body);
    return reply.send(updated);
  });

  app.delete('/users/:userId/transactions/:id', async (req, reply) => {
    const { userId, id } = req.params as { userId: string; id: string };
    await svc.delete(userId, id);
    return reply.code(204).send();
  });
};

export default transactionsRoutes;
