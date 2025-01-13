import { Prisma, PrismaClient } from '@prisma/client';

import Logger from './logger.js';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
  });
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

const seedData = async () => {
  const faq = await prisma.faq.findMany({ where: {} });
  if (faq?.length < 1) {
    await prisma.faq.createMany({
      data: [
        {
          question: 'What is your return policy?',
          answer: 'You can return any item within 30 days for a full refund.'
        },
        { question: 'What are your business hours?', answer: 'Our business hours are Monday to Friday, 9 AM to 5 PM.' }
      ]
    });
  }
};
await seedData();

prisma.$on('query' as never, (event: Prisma.QueryEvent) => {
  Logger.info(`Query: ${event.query}`);
  Logger.info(`Params: ${event.params}`);
  Logger.info(`Duration: ${event.duration}ms`);
});
