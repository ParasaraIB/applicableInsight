"use strict";

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const admin = new mongoose.Schema({
  created_at: {
    type: Date,
    default: Date.now
  },
  full_name: String,
  nip: String,
  email: String,
  salt: String,
  hash: String,
  password_reset_hash: String,
  password_reset_salt: String,
  deleted: {
    type: Boolean,
    default: false
  },
  super_user: Boolean,
  visitor: Boolean,
  edited_by: [],
  deleted_by: {},

});

// Password
admin.methods.hashPassword = function(password) {
  this.salt = bcrypt.genSaltSync(10);
  this.hash = bcrypt.hashSync(password, this.salt);
}

admin.methods.validatePassword = function(password) {
  const hash = bcrypt.hashSync(password, this.salt);
  return this.hash === hash;
}

// Password Reset
admin.methods.setPasswordResetCode = function(password) {
  this.password_reset_salt = bcrypt.genSaltSync(10);
  this.password_reset_hash = bcrypt.hashSync(password, this.password_reset_salt);
}

admin.methods.validatePasswordResetCode = function(password) {
  const password_reset_hash = bcrypt.hashSync(password, this.salt);
  return this.hash === password_reset_hash;
}

admin.methods.generateJwt = function() {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);
  return jwt.sign({
    _id: this._id,
    admin_id: this.admin_id,
    full_name: this.full_name,
    nip: this.nip,
    email: this.email,
    super_user: this.super_user,
    visitor: this.visitor,
    exp: parseInt(expiry.getTime()/1000)
  }, process.env.APP_SECRET);
}

const model = mongoose.model("Admin", admin);

module.exports = model;