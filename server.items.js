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
    size : { type: String, required: true },
    purchasePrice: String,
    soldPrice: String,
    profitPerPerson: String,
    location : { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    isSold: { type: Boolean, default: false },
    // purchaseDate: { type: Date },
    purchaseDate : String,
    upadatedDate: { type: Date, default: Date.now },
    userName : String,
}); 

const Items = mongoose.model('Items', itemSchema);

// 데이터 표시
const output = {
  dataDisplay: async (req, res) => {
    console.log("dataDisplay in ");
    try {
      const displays = await Items.find({ isDeleted: false }).sort({ purchaseDate: -1 });
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
    let image;
    let prevImage = req.body.image;
    if ((!prevImage) && req.file) {
      image = '/image/' + req.file.filename;
    }else if(prevImage){
      image = prevImage
    }else{
      image = 'https://picsum.photos/64/64'
    }



    const newItem = new Items({
      image: image,
      name : req.body.item,
      size : req.body.size,
      purchasePrice: req.body.purchasePrice,
      soldPrice: '',
      profitPerPerson: '',
      location : req.body.location,
      isDeleted: false,
      isSold : false, // 조건에 따라 isSold 값을 설정
      purchaseDate: req.body.purchaseDate, // 문자열을 Date 객체로 변환
      updatedDate: new Date(), // 오타 수정: upadatedDate → updatedDate
      userName: req.body.userName,
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
    const { image, name, purchasePrice, soldPrice, profitPerPerson, location, isSold, purchaseDate, userName, size } = req.body;
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
      item.size = size;
      item.purchasePrice = purchasePrice;
      item.soldPrice = soldPrice;
      item.profitPerPerson = profitPerPerson;
      item.location = location;
      item.isSold = isSold !== undefined ? isSold : false; // 조건에 따라 isSold 값을 설정
      item.purchaseDate = purchaseDate; // 문자열을 Date 객체로 변환
      item.updatedDate = new Date(); // 현재 날짜로 updatedDate 설정
      item.userName = userName;

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
