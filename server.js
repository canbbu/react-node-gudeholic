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

app.get('/api/customers', (req,res) =>{
  console.log("conf" + conf)
  const query = "select * from CUSTOMER"
  connection.query(
    query, (err, rows, fields) => {
      res.send(rows)
      console.log(err)
    }
  )
})

app.listen(port, () => console.log(`Listening on port ${port}`))

