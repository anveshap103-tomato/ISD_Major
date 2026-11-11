import { Router } from 'express';
import * as contentController from './content.controller.js';
import { authenticateToken } from '../../middlewares/auth.js';

const router = Router();

router.get('/', contentController.getContentList);
router.get('/categories', contentController.getCategories);

router.get('/bookmarks', authenticateToken, contentController.getBookmarks);
router.post('/bookmarks', authenticateToken, contentController.addBookmark);
router.delete(
  '/bookmarks/:contentId',
  authenticateToken,
  contentController.removeBookmark
);

// Keep parameter routes after fixed paths such as /categories and /bookmarks.
router.get('/:id', contentController.getContentById);

export default router;

