import { Router } from 'express';
import * as feedController from './feed.controller.js';
import { authenticateToken } from '../../middlewares/auth.js';

const router = Router();

router.get('/', authenticateToken, feedController.getPersonalizedFeed);

export default router;
