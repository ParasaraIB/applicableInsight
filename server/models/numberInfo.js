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
  isBackDate: Boolean,
  created_by: {},
  edited_by: [],
  deleted_by: {},
  counter_info: {},
  backIdentifier: {},
  mail_to: String,
  document_links: []
});

const model = mongoose.model("NumberInfo", numberInfo);

module.exports = model;