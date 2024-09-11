const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
const Admin = require('./server.admin');
const Items = require('./server.items');
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
router.get('/api/items', Items.output.dataDisplay);
router.post('/api/items', upload.single('image'), Items.process.dataSave);
router.post('/api/items/login', Admin.process.login);
//multipart/form-data 형식을 받기위해서는 multer처리가 필요하다.
router.post('/api/items/update', upload.single('image'), Items.process.dataUpdate);
router.delete('/api/items/:id', Items.process.delete);


// 서버 시작
app.listen(port, () => console.log(`Listening on port ${port}`));