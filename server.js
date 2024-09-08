const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const mysql = require('mysql')
const app = express()
const port = process.env.PORT || 5000
const jwt = require('jsonwebtoken'); // JWT를 사용할 경우
const secretKey = 'yourSecretKey';   // JWT 토큰 생성 시 사용할 비밀 키
const bcrypt = require('bcrypt');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))


const data = fs.readFileSync('./databases.json')
const conf = JSON.parse(data)


const connection = mysql.createConnection({
  host : conf.host,
  user : conf.user,
  password : conf.password,
  database : conf.database,
  port : conf.port,
})
connection.connect()

//multer for upload image
const multer = require('multer')
const upload = multer({dest: './upload'})

app.get('/api/customers', (req,res) =>{
  const query = "select * from CUSTOMER WHERE isDeleted = 0"
  connection.query(
    query, (err, rows, fields) => {
      res.send(rows)
      console.log(err)
    }
  )
})

app.use('./image', express.static('./upload'))

app.post('/api/customers', upload.single('image'), (req,res) => {
  let image = 'https://picsum.photos/64/64'
  if (req.file) {
    image = './image'+ req.file.filename
  }
  // 이후 데이터 처리
  let sql = 'INSERT INTO CUSTOMER VALUES (null, ?, ?, ?, ?, ?, now(), 0)'
  let name = req.body.name
  let birthday = req.body.birthday
  let gender = req.body.gender
  let job = req.body.job
  let params = [image, name, birthday, gender, job]
  connection.query(sql, params,
    (err, rows, fields) => {
      res.send(rows)
    }
  )
})

app.delete('/api/customers/:id', (req,res) => {
  let sql = 'UPDATE CUSTOMER SET isDeleted = 1 WHERE id = ?'
  let params = [req.params.id]
  connection.query(sql, params, 
    (err, rows, fields) => {
      res.send(rows)
    }
  )
})

app.post('/api/customers/login', (req, res) => {
  const { username, password } = req.body;

  // 사용자 자격 증명 확인
  let sql = 'SELECT * FROM ADMIN WHERE username = ? and password = ?';
  connection.query(sql, [username,password], (err, rows) => {
    if (err) {
      return res.status(500).send({ error: 'Database error' });
    }
    console.log("DB connection success")
    res.send(rows)
    // if (rows.length > 0) {
    //   const user = rows[0];

    //   // 비밀번호 해시 확인
    //   bcrypt.compare(password, user.password, (err, result) => {
    //     if (err) {
    //       return res.status(500).send({ error: 'Error comparing password' });
    //     }

    //     if (result) {
    //       // 비밀번호가 일치하는 경우 로그인 성공
    //       console.log("login Success")
    //       return res.send({
    //         success: true,
    //         message: 'Login successful'
    //       });
    //     } else {
    //       // 비밀번호 불일치
    //       return res.status(401).send({ error: 'Invalid username or password' });
    //     }
    //   });
    // } else {
    //   // 사용자 없음
    //   return res.status(401).send({ error: 'Invalid username or password' });
    // }
    
  });
  
});

app.listen(port, () => console.log(`Listening on port ${port}`))