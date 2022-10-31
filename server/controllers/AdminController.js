"use strict";

const {
  Admin
} = require("../models");

class AdminController {
  static async adminLogin (req, res, next) {
    try {
      const {email, password} = req.body;
      const admin = await Admin.findOne({deleted: {$ne: true}, email});
      if (!admin || !admin.validatePassword(password)) return res.status(400).json({message: "Invalid email or password"});
      const access_token = admin.generateJwt();
      const returnedAdmin = admin.toObject();
      delete returnedAdmin.hash;
      delete returnedAdmin.salt;
      delete returnedAdmin.password_reset_hash;
      delete returnedAdmin.password_reset_salt;
      return res.status(200).json({
        message: "Here's the admin credentials",
        access_token,
        admin: returnedAdmin
      });
    } catch (err) {
      console.error(err, "<<<< error in adminLogin AdminController");
      return res.status(500).json({message: "Internal server error"});
    }
  }

  static async addAdmin (req, res, next) {
    try {
      const adminAuth = await Admin.findOne({
        email: req.payload.email,
        deleted: {$ne: true},
        super_user: true
      }, {_id: 1, full_name: 1, nip: 1, email: 1}).lean();

      if (!adminAuth) return res.status(403).json({message: "Forbidden"});

      const {
        full_name,
        nip,
        email,
        password,
        confirm_password
      } = req.body;

      const checkPic = await Admin.findOne({email, deleted: {$ne: true}}).lean();
      if (checkPic && (checkPic.email === email || checkPic.nip === nip)) return res.status(400).json({message: "Admin has already been registered"});

      if (
        !full_name ||
        !nip ||
        !email ||
        !password ||
        !confirm_password
      ) return res.status(400).json({message: "Incomplete input"});

      const newAdmin = new Admin();
      newAdmin.full_name = full_name;
      if (nip.toString().length < 5) return res.status(400).json({message: "Please insert a valid NIP"});
      newAdmin.nip = nip;
      newAdmin.email = email;
      if (password !== confirm_password) return res.status(400).json({message: "Incorrect password!"});
      newAdmin.hashPassword(password);
      newAdmin.password_reset_hash = "";
      newAdmin.password_reset_salt = "";
      await newAdmin.save();

      const returnedAdmin = newAdmin.toObject();
      delete returnedAdmin.hash;
      delete returnedAdmin.salt;
      delete returnedAdmin.password_reset_hash;
      delete returnedAdmin.password_reset_salt;

      return res.status(201).json({
        message: "Admin successfully added",
        newAdmin: returnedAdmin
      });
    } catch (err) {
      console.error(err, "<<<< error in addAdmin AdminController");
      return res.status(500).json({message: "Internal server error"});
    }
  }
}

module.exports = AdminController;