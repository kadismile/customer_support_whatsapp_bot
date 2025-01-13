/* eslint-disable @typescript-eslint/no-unsafe-return */
import { OpenAI } from 'openai';

import Logger from '../libs/logger.js';
import { prisma } from '../libs/prisma.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const generateEmbedding = async (text: string) => {
  try {
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text
    });
    return embeddingResponse.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
};

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

export const findRelevantFAQ = async (queryText: string) => {
  try {
    // Step 1: Generate an embedding for the user's query
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: queryText
    });
    const queryEmbedding = embeddingResponse.data[0].embedding;

    // Step 2: Retrieve all FAQs from the database
    const faqs = await prisma.faq.findMany();

    if (faqs.length === 0) {
      return null; // No FAQs available in the database
    }

    // Step 3: Find the FAQ with the most similar embedding using cosine similarity
    let mostSimilarFaq = null;
    let highestSimilarity = -1;

    for (const faq of faqs) {
      const faqEmbedding = JSON.parse(faq.embedding); // Get the stored embedding for the FAQ
      const similarity = cosineSimilarity(queryEmbedding, faqEmbedding);

      if (similarity > highestSimilarity) {
        highestSimilarity = similarity;
        mostSimilarFaq = faq;
      }
    }

    return mostSimilarFaq;
  } catch (error) {
    Logger.error('Error finding relevant FAQ:', error);
    return null;
  }
};

const cosineSimilarity = (vecA: number[], vecB: number[]) => {
  const dotProduct = vecA.reduce((sum, value, index) => sum + value * vecB[index], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, value) => sum + value * value, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, value) => sum + value * value, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};
