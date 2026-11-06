import { Router } from 'express';
import * as feedController from './feed.controller.js';
import { authenticateToken } from '../../middlewares/auth.js';

const router = Router();

// Route placeholders (Jatin)
// router.get('/', authenticateToken, feedController.getPersonalizedFeed);

export default router;

