import express from 'express';
import {
  getCandidates,
  getCandidate,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  searchCandidates
} from '../controllers/candidateController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protection to all routes
router.use(protect);

router.route('/')
  .get(getCandidates)
  .post(createCandidate);

router.get('/search/:query', searchCandidates);

router.route('/:id')
  .get(getCandidate)
  .put(updateCandidate)
  .delete(deleteCandidate);

export default router;
