const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
const ctrl = require('./server.ctrl');
const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 이미지 파일 제공
app.use('/image', express.static('upload'));

// 라우터를 app에 연결
app.use('/', router);

// multer 설정
const multer = require('multer');
const upload = multer({ dest: './upload' });

// 라우터 설정
router.get('/api/customers', ctrl.output.dataDisplay);
router.post('/api/customers', upload.single('image'), ctrl.process.dataUpdate);
router.post('/api/customers/login', ctrl.process.login);
router.delete('/api/customers/:id', ctrl.process.delete);

// 서버 시작
app.listen(port, () => console.log(`Listening on port ${port}`));