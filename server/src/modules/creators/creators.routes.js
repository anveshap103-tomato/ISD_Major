import { Router } from 'express';
import * as creatorsController from './creators.controller.js';

const router = Router();

// 1. GET /api/creators — List creators with optional query filters
router.get('/', creatorsController.getCreators);

// 2. GET /api/creators/search — Dedicated search endpoint (must be defined before /:id)
router.get('/search', creatorsController.searchCreators);

// 3. GET /api/creators/:id/content — Creator published educational content
router.get('/:id/content', creatorsController.getCreatorContent);

// 4. GET /api/creators/:id — Detailed creator profile by ID
router.get('/:id', creatorsController.getCreatorById);

export default router;

