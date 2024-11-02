import express from 'express';
import { getExam } from '../controllers/examController.js';

const router = express.Router();

router.get('/get-exam', getExam);

export default router;