import { con } from 'controller';
import express from 'express';
import { uploader } from 'func/uploader';

export const uploadRouter = express.Router();

uploadRouter.post('/', uploader.single('image'), con.upload.uploadController.add);

uploadRouter.get('/sharp', uploader.single('image'), con.upload.uploadController.sharp.get);

uploadRouter.post('/:type', uploader.single('image'), con.upload.uploadController.sharp.sharpType);
