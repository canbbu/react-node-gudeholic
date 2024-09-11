"use strict"

const mongoose = require('mongoose');
const fs = require('fs');
const express = require('express');
const app = express();
const moment = require('moment-timezone'); 

// databases.json 파일에서 MongoDB URI 읽기
const data = fs.readFileSync('./databases.json');
const conf = JSON.parse(data);


// MongoDB 연결
mongoose.connect(conf.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Mongoose 스키마 및 모델 정의
const itemSchema = new mongoose.Schema({
    image: String,
    name: { type: String, required: true },
    purchasePrice: String,
    soldPrice: String,
    profitPerPerson: String,
    location : { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    isSold: { type: Boolean, default: false },
    // purchaseDate: { type: Date },
    purchaseDate : String,
    upadatedDate: { type: Date, default: Date.now }
}); 

const Items = mongoose.model('Items', itemSchema);

// 데이터 표시
const output = {
  dataDisplay: async (req, res) => {
    console.log("dataDisplay in ");
    try {
      const displays = await Items.find({ isDeleted: false });
      res.send(displays);
    } catch (err) {
      res.status(500).send({ error: 'Database error' });
    }
  }
};


// 데이터 업데이트 및 추가
const process = {
  dataSave: async (req, res) => {

    //image case
    //let image = 'https://picsum.photos/64/64';
    let image = '';
    let prevImage = req.body.image;
    if ((!prevImage) && req.file) {
      image = '/image/' + req.file.filename;
    }else if(prevImage){
      image = prevImage
    }else{
      image = 'https://picsum.photos/64/64'
    }

    // req.body에서 날짜 문자열 가져오기
    console.log("req.body.purchaseDate : "+ req.body.purchaseDate)
    const purchaseDateStr = req.body.purchaseDate ? new Date(req.body.purchaseDate) : new Date(); // 예: "2024/09/09"
    const isSold = req.body.isSold;
    console.log("purchaseDateStr"+ purchaseDateStr)

    // // 도쿄 시간대로 날짜 문자열을 UTC로 변환
    // const purchaseDateTokyo = moment.tz(purchaseDateStr, 'YYYYMMDD', 'Asia/Tokyo');
    // const purchaseDateUTC = purchaseDateTokyo.toISOString(); // UTC 형식으로 
    
    // YYYYMMDD 형식으로 변환
    const year = purchaseDateStr.getFullYear();
    const month = (purchaseDateStr.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 1을 더함
    const day = purchaseDateStr.getDate().toString().padStart(2, '0');

    // 최종 YYYYMMDD 문자열
    const formattedDate = `${year}${month}${day}`;
    console.log("formattedDate"+ formattedDate)

    

    const newItem = new Items({
      image: req.body.image,
      name: req.body.name,
      purchasePrice: req.body.purchasePrice,
      soldPrice: req.body.soldPrice,
      profitPerPerson: req.body.profitPerPerson,
      location : req.body.location,
      isDeleted: false,
      isSold: isSold ? isSold : false, // 조건에 따라 isSold 값을 설정
      purchaseDate: req.body.purchaseDate, // 문자열을 Date 객체로 변환
      updatedDate: new Date() // 오타 수정: upadatedDate → updatedDate
    });
    
    console.log("newItem  : " +newItem)

    try {
        const savedItem = await newItem.save();
        console.log("savedItem : "+ savedItem)
        res.send(savedItem);
      } catch (err) {
        res.status(500).send({ error: 'Database error' });
      }
      
  },

  dataUpdate: async (req, res) => {

    const id = req.body.id;
    console.log("id :" +id )
    const { image, name, purchasePrice, soldPrice, profitPerPerson, location, isSold, purchaseDate } = req.body;
    console.log("image : "+ image )
    try {
      // 기존 문서를 찾습니다.
      const item = await Items.findById(id);
      console.log("item : " + item)

      if (!item) {
        return res.status(404).send({ error: 'Item not found' });
      }

      // 문서의 필드를 업데이트합니다.
      item.image = image;
      item.name = name;
      item.purchasePrice = purchasePrice;
      item.soldPrice = soldPrice;
      item.profitPerPerson = profitPerPerson;
      item.location = location;
      item.isSold = isSold !== undefined ? isSold : false; // 조건에 따라 isSold 값을 설정
      item.purchaseDate = purchaseDate; // 문자열을 Date 객체로 변환
      item.updatedDate = new Date(); // 현재 날짜로 updatedDate 설정

      // 업데이트된 문서를 저장합니다.
      const updatedItem = await item.save();

      console.log('updatedItem: ', updatedItem);
      res.send(updatedItem);
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: 'Database error' });
    }

      
  },

  //데이터 삭제
  delete: async (req, res) => {
    console.log("delete in ");
    try {
      // ID로 항목 찾고 업데이트
      const deletedItem = await Items.findByIdAndUpdate(
        req.params.id,
        { isDeleted: true },
        { new: true }
      );

      if (!deletedItem) {
        return res.status(404).send({ error: 'Item not found' });
      }

      res.send(deletedItem);
    } catch (err) {
      res.status(500).send({ error: 'Database error' });
    }
  },

};

module.exports = {
  output,
  process,
};
