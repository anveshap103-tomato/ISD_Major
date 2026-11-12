
import { Router } from 'express';
import * as connectionsController from './connections.controller.js';
import { authenticateToken } from '../../middlewares/auth.js';

const router = Router();

router.post('/request', authenticateToken, connectionsController.sendRequest);
router.get('/discover', authenticateToken, connectionsController.discoverUsers);
router.get('/', authenticateToken, connectionsController.getConnections);
router.patch('/:id', authenticateToken, connectionsController.respondToRequest);

export default router;
