import { Router } from 'express';
import { makeMove } from '../controllers/gameController';

const router = Router();

// POST /api/move
router.post('/move', makeMove);

export default router;
