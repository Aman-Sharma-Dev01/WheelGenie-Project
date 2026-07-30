import express from 'express';
import * as uploadController from '../controllers/uploadController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

const router = express.Router();

router.use(protect);

router.post('/image', upload.single('file'), uploadController.uploadImage);
router.post('/document', upload.single('file'), uploadController.uploadDocument);
router.delete('/:id', uploadController.deleteUpload);

export default router;