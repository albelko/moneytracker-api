import fp from 'fastify-plugin';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';

export const swaggerPlugin = fp(async (app) => {
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'MoneyTracker API',
        version: '0.1.0',
        contact: {
          name: 'API Support',
          email: 'albelko@pm.me',
        },
        description: `**A comprehensive financial management API for tracking income, expenses, and financial goals.**

**Key Features:**
- 🔐 JWT Authentication & Security
- 💰 Transaction Management
- 📊 Financial Analytics & Reports
- 👥 User & Account Management
- 📈 Budgeting & Goal Tracking

---


**Built with ❤️ using TypeScript, Fastify, Prisma, and PostgreSQL for high performance and reliability.**`,

        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT',
        },
      },
      servers: [
        {
          url: 'http://localhost:3004',
          description: 'Development server',
        },
        {
          url: 'https://api-staging.moneytracker.com',
          description: 'Staging server - Testing environment',
        },
        {
          url: 'https://api.moneytracker.com',
          description: 'Production server - Live API',
        },
      ],
    },
  });
  await app.register(swaggerUI, { routePrefix: '/docs' });
});
