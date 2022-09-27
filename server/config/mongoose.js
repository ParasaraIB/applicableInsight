"use strict";

const mongoose = require("mongoose");

const uri = process.env.DB_URL;

async function mongooseConnect() {
  try {
    await mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log("Successfully connected to MongoDB");
  } catch (err) {
    console.error(err, "<<<< Failed connecting to MongoDB");
  }
}

module.exports = mongooseConnect;