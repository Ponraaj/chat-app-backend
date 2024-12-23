import express from 'express';
import { auth } from '../middlewares/auth.js';
import { sendMessage, getMessages, deleteMessage } from '../controllers/messageController.js';

const router = express.Router();

// Send Message
router.post('/', auth, sendMessage);

// Get all Messages
router.get('/:userId', auth, getMessages);

// Delete a Message
router.delete('/:id', auth, deleteMessage);

export default router;
