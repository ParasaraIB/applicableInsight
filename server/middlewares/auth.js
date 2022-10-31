"use strict";

const jwt = require("jsonwebtoken");
const { Admin } = require("../models");

async function authentication(req, res, next) {
  try {
    const {access_token} = req.headers;
    const adminData = jwt.verify(access_token, process.env.APP_SECRET);

    const admin = await Admin.findOne({email: adminData.email});
    if (admin) {
      req.payload = adminData;
      next();
    } else {
      return res.status(401).json({message: "Admin is not authenticated"});
    }
  } catch (err) {
    console.error(err, "<<<< error in authentication");
    return res.status(500).json({message: "Internal server error"});
  }
}

module.exports = authentication;