import { config } from 'config';
import { RequestHandler } from 'express';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

enum SharpEnum {
	resize,
	rotate,
	composite,
	grayscale,
}

const typeList = Object.keys(SharpEnum).filter((key) => isNaN(Number(key)));

export const get: RequestHandler<any, any, any> = async (req, res, next) => {
	res.json({ success: true, typeList });
};

export const sharpType: RequestHandler<{ type: string }, any, any> = async (req, res, next) => {
	const { type = '' } = req.params;
	if (!typeList.includes(type)) return next({ status: 404, message: '존재하지 않는 타입입니다.' });
	if (!req.file || !req.file.path) return next({ status: 404, message: '파일을 첨부해주세요' });
	const { rotate = 0 } = req.body;
	if (!rotate && type === 'rotate') {
		return next({ status: 404, message: '회전 정보를 입력해주세요' });
	}

	try {
		let resize = {};
		let compositeList = [];

		if (type === 'resize') resize = { width: 600 };

		if (type === 'composite') {
			const watermark01 = await sharp('uploads/watermark/sy01.png').toBuffer();
			compositeList.push({
				input: watermark01,
				gravity: 'northwest',
			});
		}
		const ext = path.extname(req.file!.filename).toLowerCase();
		let filename = `./uploads/${req.file!.filename}`;
		const webpFilename = filename.slice(0, -ext.length) + '.webp';
		sharp(req.file.path) // 압축할 이미지 경로
			.resize(resize) // 비율을 유지하며 가로 크기 줄이기
			.rotate(Number(rotate))
			.composite(compositeList)
			.greyscale(type === 'grayscale')
			.webp()
			.withMetadata() // 이미지의 exif데이터 유지
			.toFile(webpFilename);

		res.json({ imageUrl: `${config.server.host}/${req.file!.filename}` });
	} catch (err) {
		console.warn(err);
	}
};
