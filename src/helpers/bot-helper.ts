/* eslint-disable @typescript-eslint/no-unsafe-return */

import Logger from '../libs/logger.js';
import { prisma } from '../libs/prisma.js';

export const logUserQuery = async (userQuery: string, botResponse: string) => {
  try {
    await prisma.log.create({
      data: {
        userQuery,
        botResponse
      }
    });
    Logger.info('User query and bot response logged successfully.');
  } catch (error) {
    console.error('Error logging user query:', error);
  }
};

export const findFAQ = async (queryText: string) => {
  try {
    const faq = await prisma.faq.findFirst({
      where: {
        question: {
          contains: queryText,
          mode: 'insensitive'
        }
      }
    });

    return faq;
  } catch (error) {
    console.error('Error querying FAQ:', error);
    return null;
  }
};
