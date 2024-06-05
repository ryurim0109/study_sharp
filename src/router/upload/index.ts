import { con } from 'controller';
import express from 'express';
import { uploader } from 'func/uploader';

export const uploadRouter = express.Router();

uploadRouter.post('/', uploader.single('image'), con.upload.uploadController.add);

uploadRouter.post('/sharp', uploader.single('image'), con.upload.uploadController.sharp.resize);

uploadRouter.post('/rotate', uploader.single('image'), con.upload.uploadController.sharp.rotate);
