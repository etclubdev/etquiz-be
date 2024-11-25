import express from 'express';
import { getInfoByMssv, createInfo, updateResult, exportExcelFile } from '../controllers/infoController.js';

const router = express.Router();

router.get('/info', getInfoByMssv);
router.post('/info', createInfo);
router.post('/update-result', updateResult);
router.get('/file', exportExcelFile)

export default router;