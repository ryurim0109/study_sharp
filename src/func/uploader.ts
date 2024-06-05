import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, 'uploads/');
	},
	filename(req, file, cb) {
		const ext = path.extname(file.originalname);
		const timestamp = new Date().getTime().valueOf();

		const filename = path.basename(file.originalname, ext) + timestamp + ext;
		cb(null, filename);
	},
});
export const uploader = multer({ storage });
