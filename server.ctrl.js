"use strict"

const mysql = require('mysql');
const fs = require('fs');
const express = require('express');

const data = fs.readFileSync('./databases.json');
const conf = JSON.parse(data);

const connection = mysql.createConnection({
  host : conf.host,
  user : conf.user,
  password : conf.password,
  database : conf.database,
  port : conf.port,
});
connection.connect();

const output = {
  dataDisplay: (req, res) => {
    console.log("dataDisplay in ")
    const query = "SELECT * FROM CUSTOMER WHERE isDeleted = 0";
    connection.query(query, (err, rows) => {
      res.send(rows);
      console.log(err);
    });
  },
};

const process = {
  dataUpdate: (req, res) => {
    console.log("dataUpdate in ")
    let image = 'https://picsum.photos/64/64';
    if (req.file) {
      image = '/image/' + req.file.filename;
    }
    let sql = 'INSERT INTO CUSTOMER VALUES (null, ?, ?, ?, ?, ?, now(), 0)';
    let params = [image, req.body.name, req.body.birthday, req.body.gender, req.body.job];
    connection.query(sql, params, (err, rows) => {
      res.send(rows);
    });
  },

  delete: (req, res) => {
    console.log("delete in ")
    let sql = 'UPDATE CUSTOMER SET isDeleted = 1 WHERE id = ?';
    let params = [req.params.id];
    connection.query(sql, params, (err, rows) => {
      res.send(rows);
    });
  },

  login: (req, res) => {
    console.log("login in ")
    const { username, password } = req.body;

    // 사용자 자격 증명 확인
    const sql = 'SELECT * FROM ADMIN WHERE username = ?';
    connection.query(sql, [username], (err, rows) => {
      if (err) {
        return res.status(500).send({ error: 'Database error' });
      }

      return res.send({
        success: true,
        message: 'Login successful',
      })
    });
  }
};

module.exports = {
  output,
  process,
};
