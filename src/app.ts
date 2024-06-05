import { config } from 'config';
import express, { ErrorRequestHandler } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import fs, { promises as fsSync } from 'fs';
import { router } from 'router';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

if (!fs.existsSync('./uploads')) {
	fs.mkdirSync('./uploads');
}

app.use(express.static('upload'));

app.use('/', router);

const expressErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
	if (err.status) {
		return res.status(err.status).send({ success: false, message: err.message });
	}
	res.status(500).send({
		success: false,
		message: '알 수 없는 에러가 발생했습니다. 같은 증상이 반복될 경우 고객센터에 문의해주세요.',
	});
};
app.use(expressErrorHandler);
const server = app.listen(config.server.port);

server.on('listening', () => {
	console.log(
		`
${new Date()}
  /\___/\/n
/ 0 . 0  \/n
__________
|        |


    `
	);
});
