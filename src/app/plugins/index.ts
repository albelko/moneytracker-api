import helmet from '@fastify/helmet';
import cookie from '@fastify/cookie';
import multipart from '@fastify/multipart';
import jwt from '@fastify/jwt';

import prismaPlugin from './prisma.js';
import { swaggerPlugin } from './swagger.js';

export async function registerPlugins(app: any, cfg: any) {
  await app.register(helmet);
  await app.register(cookie);
  await app.register(multipart, { limits: { fileSize: 10 * 1024 * 1024 } });
  await app.register(jwt, {
    secret: cfg.JWT_ACCESS_SECRET,
    cookie: { cookieName: 'access_token', signed: false },
  });
  await app.register(prismaPlugin);
  await app.register(swaggerPlugin);
}
