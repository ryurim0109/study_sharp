import { config } from 'config';
import { RequestHandler } from 'express';

export const add: RequestHandler<any, any, any> = async (req, res, next) => {
	res.send({ success: true, imageUrl: `${config.server.host}/${req.file?.filename}` });
};
