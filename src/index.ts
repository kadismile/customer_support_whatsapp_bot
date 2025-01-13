import app from './app.js';
import Logger from './libs/logger.js';
import { prisma } from './libs/prisma.js';

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => Logger.info(`🌏 Server running on PORT: ${PORT}`));

process.on('SIGINT', async () => {
  Logger.info('Disconnecting >>>>>>');
  await prisma.$disconnect();
  process.exit(0);
});
