"use strict";

const mongoose = require("mongoose");

const docType = new mongoose.Schema({
  created_at: {
    type: Date,
    default: Date.now
  },
  name: String,
  type: String
});

const model = mongoose.model("DocType", docType);

module.exports = model;