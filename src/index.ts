import { buildServer } from '@/app/server.js';
import { loadConfig } from '@/config/env.js';

async function main() {
  const cfg = loadConfig();
  const app = await buildServer(cfg);

  await app.listen({ host: cfg.HOST, port: cfg.PORT });
  app.log.info(`API running at http://${cfg.HOST}:${cfg.PORT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
