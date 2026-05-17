import express from 'express';
import { basicMatch, aiShortlist } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/match', basicMatch);
router.post('/shortlist', aiShortlist);

export default router;
