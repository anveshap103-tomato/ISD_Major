import { Router } from 'express';
import * as usersController from './users.controller.js';
import { authenticateToken } from '../../middlewares/auth.js';

const router = Router();

router.get('/me', authenticateToken, usersController.getMe);
router.put('/me', authenticateToken, usersController.updateMe);
router.get('/interests', usersController.getInterests);
router.put('/me/interests', authenticateToken, usersController.updateMyInterests);
export default router;
