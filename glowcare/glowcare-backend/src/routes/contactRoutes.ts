import { Router, Request, Response } from 'express';
import { ContactMessage } from '../models/ContactMessage.js';
import { NewsletterSubscriber } from '../models/NewsletterSubscriber.js';
import { isMongoDBConnected } from '../config/db.js';
import { inMemoryStore } from '../data/inMemoryStore.js';

const router = Router();

// POST /api/contact
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      res.status(400).json({
        success: false,
        message: 'Name, email, subject, and message are required.'
      });
      return;
    }

    if (isMongoDBConnected) {
      const contactMsg = await ContactMessage.create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim()
      });

      res.status(201).json({
        success: true,
        message: 'Thank you for reaching out! Our skincare specialists will reply within 24 hours.',
        contact: contactMsg
      });
    } else {
      const inMemMsg = {
        _id: `msg_${Date.now()}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        status: 'unread' as const,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      inMemoryStore.contactMessages.unshift(inMemMsg);

      res.status(201).json({
        success: true,
        message: 'Thank you for reaching out! Our skincare specialists will reply within 24 hours. (Demo Mode)',
        contact: inMemMsg
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/newsletter
router.post('/newsletter', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    if (isMongoDBConnected) {
      const existing = await NewsletterSubscriber.findOne({ email: cleanEmail });
      if (existing) {
        res.status(200).json({
          success: true,
          message: 'You are already subscribed to the RubyCare editorial newsletter!'
        });
        return;
      }

      await NewsletterSubscriber.create({ email: cleanEmail });
      res.status(201).json({
        success: true,
        message: 'Welcome to the RubyCare community! Enjoy 10% off your first order with code RUBY10.'
      });
    } else {
      if (!inMemoryStore.subscribers.includes(cleanEmail)) {
        inMemoryStore.subscribers.push(cleanEmail);
      }
      res.status(201).json({
        success: true,
        message: 'Welcome to the RubyCare community! Enjoy 10% off your first order with code RUBY10. (Demo Mode)'
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
