import { Router } from 'express';
import { analyzeURL, getKeywords, getUserHistory, getAdminStats } from '../controllers/seoController.js';
import { verifyToken, requireAdmin, optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/analyze', optionalAuth, analyzeURL);
router.get('/keywords', getKeywords);
router.get('/history', verifyToken, getUserHistory);
router.get('/admin/stats', verifyToken, requireAdmin, getAdminStats);

export default router;
