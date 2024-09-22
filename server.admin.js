"use strict"

const mongoose = require('mongoose');
const fs = require('fs');
const express = require('express');
const app = express();

// databases.json 파일에서 MongoDB URI 읽기
const data = fs.readFileSync('./databases.json');
const conf = JSON.parse(data);


// MongoDB 연결
mongoose.connect(conf.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Admin 스키마 및 모델 정의
const adminSchema = new mongoose.Schema({
  username: String,
  password: String
}); 

const Admin = mongoose.model('Admin', adminSchema);

// 데이터 업데이트 및 추가
const process = {

  // 로그인 처리
  login: async (req, res) => {
    console.log("login in ");
    console.log("req.body : " + JSON.stringify(req.body)); // req.body 내용을 확인
    const { username, password } = req.body;

    try {
      // 사용자 자격 증명 확인
      console.log("username : "+ username + "password : " + password)
      const admin = await Admin.findOne({username});
      console.log("admin : "+ admin)

      if (!admin) {
        return res.status(404).send({ error: 'Admin not found' });
      }

      console.log("password : "+ password + "admin.password : " + admin.password);
      const isMatch = password === admin.password;
      console.log("isMatch:" + isMatch)
  
      if (!isMatch) {
        return res.status(400).send({ error: 'Invalid credentials' });
      }

      return res.send({
        success: true,
        message: 'Login successful',
      });
    } catch (err) {
      return res.status(500).send({ error: 'Database error' });
    }

  }
};

module.exports = {
  process,
};
