"use strict"

const mongoose = require("mongoose");

const numberInfo = new mongoose.Schema({
  created_at: Date,
  serial_number: Number,
  directed_to: String,
  regarding: String,
  pic_name: String,
  doc_number: String,
  deleted: {
    type: Boolean,
    default: false
  },
  edited_by: [],
  deleted_by: [],
  counter_info: {},
  backIdentifier: {}
});

const model = mongoose.model("NumberInfo", numberInfo);

module.exports = model;