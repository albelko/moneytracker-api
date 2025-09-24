import Fastify from 'fastify';
import type { AppConfig } from '@/config/env';
import { registerPlugins } from '@/app/plugins';
import { registerRoutes } from '@/app/routes';
import cors from '@fastify/cors';

export async function buildServer(cfg: AppConfig) {
  const app = Fastify({
    logger: {
      level: cfg.LOG_LEVEL,
    },
  });

  await registerPlugins(app, cfg);
  await registerRoutes(app);

  await app.register(cors, { origin: true });

  app.setErrorHandler((err, req, reply) => {
    req.log.error({ err }, 'unhandled');
    reply.code(err.statusCode || 500).send({ message: 'Internal Error' });
  });

  return app;
}
