import express from 'express';

import { whatsAppBot } from '../controllers/session_controller.js';

const router = express.Router();

router.post('/activate-bot', whatsAppBot);

export default router;
