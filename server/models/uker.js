"use strict";

const mongoose = require("mongoose");

const uker = new mongoose.Schema({
  created_at: {
    type: Date,
    default: Date.now
  },
  name: String,
  abbreviation: String,
});

const model = mongoose.model("Uker", uker);

module.exports = model;