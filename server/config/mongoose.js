"use strict";

const mongoose = require("mongoose");
const {ServerApiVersion} = require("mongodb")

const uri = process.env.DB_URL2;

async function mongooseConnect() {
  try {
    await mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true, serverApi:ServerApiVersion.v1});
    console.log("Successfully connected to MongoDB");
  } catch (err) {
    console.error(err, "<<<< Failed connecting to MongoDB");
  }
}

module.exports = mongooseConnect;