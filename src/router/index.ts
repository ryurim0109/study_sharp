import express from 'express';
import { uploadRouter } from './upload';

export const router = express.Router();
router.use('/upload', uploadRouter);
