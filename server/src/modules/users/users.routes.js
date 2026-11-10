import { Router } from 'express';
import * as usersController from './users.controller.js';
import { authenticateToken } from '../../middlewares/auth.js';

const router = Router();

router.get('/me', authenticateToken, usersController.getMe);
router.put('/me', authenticateToken, usersController.updateMe);

export default router;
