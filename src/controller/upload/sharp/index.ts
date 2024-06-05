import { RequestHandler } from 'express';
import fs from 'fs';
import sharp from 'sharp';

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
	} catch (err) {
		console.log(err);
	}
	res.json({ filename: `${req.file.filename}` });
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
	} catch (err) {
		console.log(err);
	}
	res.json({ filename: `${req.file.filename}` });
};
