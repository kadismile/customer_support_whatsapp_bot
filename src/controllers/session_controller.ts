import { Request, Response } from 'express';
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;

import { asyncHandler } from '../helpers/asyncHandler.js';
import { findFAQ, logUserQuery } from '../helpers/bot-helper.js';
import Logger from '../libs/logger.js';

export const whatsAppBot = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body as { email: string };

  // Generate a unique session ID based on the email
  const sessionId = email.replace(/@.*/, '');

  // In-memory session storage
  const sessions = new Map<string, { name?: string }>();

  // Initialize WhatsApp client
  const whatsApp = new Client({
    authStrategy: new LocalAuth({
      clientId: sessionId,
      dataPath: './sessions'
    })
  });

  // Listen for QR code event
  whatsApp.on('qr', qr => {
    Logger.info('QR code received');
    return res.status(200).json({
      status: 'success',
      code: qr // Return the QR code to the client
    });
  });

  // Handle when the client is ready
  whatsApp.on('ready', () => {
    Logger.info('WhatsApp client is ready');
  });

  // Handle incoming messages
  whatsApp.on('message', async message => {
    const userPhone = message.from; // Unique identifier for the user
    let session = sessions.get(userPhone);
    const userQuery = message.body.trim();
    let botResponse = '';

    if (userQuery === 'EXIT') {
      sessions.delete(userPhone);
      await whatsApp.sendMessage(userPhone, "Your session has been ended. Type 'Hi' to start again.");
      return;
    }

    if (userQuery === 'RESET') {
      sessions.set(userPhone, {}); // Reset the session
      await whatsApp.sendMessage(userPhone, "Your session has been reset. Type 'Hi' to start fresh.");
      return;
    }

    if (!session) {
      // Create a session for the user if it doesn't exist
      session = {};
      sessions.set(userPhone, session);
    }

    if (!session.name) {
      // If the name is not stored in the session
      const beginerMessages = ['hello', 'hi', 'hey', 'whatsup'];
      if (beginerMessages.includes(userQuery.toLowerCase())) {
        // Prompt the user for their name
        botResponse = "Hi! I'm Chaty, your support assistant. What's your name?";
        await whatsApp.sendMessage(userPhone, botResponse);
      } else if (!session.name) {
        // Save the name and respond
        session.name = userQuery;
        botResponse = `Nice to meet you, ${session.name}! How can I assist you?`;
        await whatsApp.sendMessage(userPhone, botResponse);
      }
    } else {
      // Continue the conversation using the stored name
      const queryText = userQuery.toLowerCase();
      const faq = await findFAQ(queryText);

      if (faq) {
        // If a matching question is found, return the answer
        botResponse = faq.answer;
        await whatsApp.sendMessage(userPhone, `${botResponse}`);
      } else {
        botResponse = "Sorry, I don't have an answer to that question. How else can I assist you?";
        // If no match is found, ask OpenAI for a generic response
        await whatsApp.sendMessage(userPhone, botResponse);
      }
    }
    await logUserQuery(userQuery, botResponse);
  });

  // Initialize the WhatsApp client
  await whatsApp.initialize();
});
