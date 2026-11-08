import { Router } from 'express';
import * as authController from './auth.controller.js';
import { authenticateToken } from '../../middlewares/auth.js';


const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticateToken, authController.getMe);

router.get('/me', authenticateToken, authController.getMe);

export default router;

