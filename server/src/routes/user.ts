import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { auth } from '../middleware/auth';
import { getMessaging } from 'firebase-admin/messaging';

const router = express.Router();

// Register user
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 })
  ],
  async (req: express.Request, res: express.Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = new User({
        email,
        password: hashedPassword
      });

      await user.save();

      // Generate token
      const token = jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      res.status(201).json({ user, token });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Login user
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').exists()
  ],
  async (req: express.Request, res: express.Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      // Generate token
      const token = jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      res.json({ user, token });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Update push notification token
router.post('/push-token', auth, async (req: any, res: express.Response) => {
  try {
    const { pushToken } = req.body;

    if (!pushToken) {
      return res.status(400).json({ error: 'Push token is required' });
    }

    // Update user's push token
    req.user.pushToken = pushToken;
    await req.user.save();

    res.json({ message: 'Push token updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Send push notification
router.post('/send-notification', auth, async (req: any, res: express.Response) => {
  try {
    const { title, body } = req.body;

    if (!title || !body) {
      return res.status(400).json({ error: 'Title and body are required' });
    }

    // Get all users with push tokens
    const users = await User.find({ pushToken: { $exists: true } });
    const tokens = users.map(user => user.pushToken).filter(Boolean);

    if (tokens.length === 0) {
      return res.status(400).json({ error: 'No users with push tokens found' });
    }

    // Send notification to all users
    const message = {
      notification: {
        title,
        body
      },
      tokens
    };

    const response = await getMessaging().sendMulticast(message);
    
    res.json({
      message: 'Notifications sent successfully',
      successCount: response.successCount,
      failureCount: response.failureCount
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Error sending notification' });
  }
});

export default router; 