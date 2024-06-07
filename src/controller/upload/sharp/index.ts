import { RequestHandler } from 'express';
import fs from 'fs';
import sharp from 'sharp';

enum SharpType {
	resize,
	rotate,
	composite,
}

const typeList = Object.keys(SharpType).filter((key) => isNaN(Number(key)));

export const get: RequestHandler<any, any, any> = async (req, res, next) => {
	res.json({ success: true, typeList });
};

export const resize: RequestHandler<any, any, any> = async (req, res, next) => {
	if (!req.file || !req.file.path) return;

	try {
		sharp(req.file.path) // 압축할 이미지 경로
			.resize({ width: 600 }) // 비율을 유지하며 가로 크기 줄이기
			.withMetadata() // 이미지의 exif데이터 유지
			.toBuffer((err, buffer) => {
				if (err) throw err;
				// 압축된 파일 새로 저장(덮어씌우기)
				fs.writeFile(req.file!.path, buffer, (err) => {
					if (err) throw err;
				});
			});
		res.json({ filename: `${req.file.filename}` });
	} catch (err) {
		console.log(err);
	}
};

export const rotate: RequestHandler<
	any,
	any,
	{
		rotate: number;
	}
> = async (req, res, next) => {
	if (!req.file || !req.file.path) return next({ status: 404, message: '파일을 첨부해주세요' });
	const { rotate } = req.body;
	if (!rotate) return next({ status: 404, message: '회전 정보를 입력해주세요' });

	try {
		sharp(req.file.path) // 압축할 이미지 경로
			.rotate(Number(rotate)) // rotate
			.withMetadata() // 이미지의 exif데이터 유지
			.toBuffer((err, buffer) => {
				if (err) throw err;
				// 압축된 파일 새로 저장(덮어씌우기)
				fs.writeFile(req.file!.path, buffer, (err) => {
					if (err) throw err;
				});
			});
		res.json({ filename: `${req.file.filename}` });
	} catch (err) {
		console.log(err);
	}
};

export const sharpType: RequestHandler<{ type: string }, any, any> = async (req, res, next) => {
	const { type = '' } = req.params;
	if (!typeList.includes(type)) return next({ status: 404, message: '존재하지 않는 타입입니다.' });
	if (!req.file || !req.file.path) return next({ status: 404, message: '파일을 첨부해주세요' });

	try {
		switch (type) {
			case 'resize':
				sharp(req.file.path) // 압축할 이미지 경로
					.resize({ width: 600 }) // 비율을 유지하며 가로 크기 줄이기
					.withMetadata() // 이미지의 exif데이터 유지
					.toBuffer((err, buffer) => {
						if (err) throw err;
						// 압축된 파일 새로 저장(덮어씌우기)
						fs.writeFile(req.file!.path, buffer, (err) => {
							if (err) throw err;
						});
					});
				res.json({ filename: `${req.file.filename}` });
				break;
			case 'rotate':
				const { rotate } = req.body;
				if (!rotate) return next({ status: 404, message: '회전 정보를 입력해주세요' });
				sharp(req.file.path) // 압축할 이미지 경로
					.rotate(Number(rotate)) // rotate
					.withMetadata() // 이미지의 exif데이터 유지
					.toBuffer((err, buffer) => {
						if (err) throw err;
						// 압축된 파일 새로 저장(덮어씌우기)
						fs.writeFile(req.file!.path, buffer, (err) => {
							if (err) throw err;
						});
					});
				res.json({ filename: `${req.file.filename}` });
				break;
			case 'composite':
				const watermark00 = await sharp('uploads/watermark/sy.png').toBuffer();
				const watermark01 = await sharp('uploads/watermark/sy01.png').toBuffer();
				const watermark02 = await sharp('uploads/watermark/sy02.png').toBuffer();

				sharp(req.file.path)
					.composite([
						{
							input: watermark00,
							gravity: 'north',
						},
						{
							input: watermark01,
							gravity: 'south',
						},
						{
							input: watermark02,
							gravity: 'east',
						},
					])
					.withMetadata()
					.toBuffer((err, buffer) => {
						if (err) throw err;
						fs.writeFile(req.file!.path, buffer, (err) => {
							if (err) throw err;
						});
					});
				res.json({ filename: `${req.file.filename}` });
				break;
			default:
				break;
		}
	} catch (err) {
		console.warn(err);
	}
};
