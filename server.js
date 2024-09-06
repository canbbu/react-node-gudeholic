const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const mysql = require('mysql')
const app = express()
const port = process.env.PORT || 5000

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
  const query = "select * from CUSTOMER"
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
  let sql = 'INSERT INTO CUSTOMER VALUES (null, ?, ?, ?, ?, ?)'
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

app.listen(port, () => console.log(`Listening on port ${port}`))