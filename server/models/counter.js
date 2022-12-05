"use strict";

const mongoose = require("mongoose");

const counter = new mongoose.Schema({
  name: String,
  type: String,
  year: String,
  count: Number,
  uker: String,
  total: Number,
  deletedNumber: []
});

const model = mongoose.model("Counter", counter);

module.exports = model;