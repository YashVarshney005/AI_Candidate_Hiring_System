import express from 'express';
import { basicMatch } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', basicMatch);

export default router;
