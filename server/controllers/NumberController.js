"use strict";

const nodemailer = require("nodemailer");

const {
  Counter,
  NumberInfo,
  Admin
} = require("../models");

class NumberController {
  static async addDocNumber (req, res, next) {
    try {
      const adminAuth = await Admin.findOne({
        email: req.payload.email,
        deleted: {$ne: true}
      }, {_id: 1, full_name: 1, nip: 1, email: 1}).lean();

      if (!adminAuth) return res.status(403).json({message: "Forbidden"});

      const isSendingEmail = false;

      const {
        name,
        uker,
        type,
        directed_to,
        regarding,
        pic_name,
        isBackDate,
        backDate,
        mail_to
      } = req.body;

      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const convBackDate = new Date(backDate);

      let alphabet = "";
      let numbering = {};
      let docNumberCount = 0;
      const promise_all = [];
      const counterQuery = {name, type, year};
      if (uker) counterQuery.uker = uker;
      if (isBackDate && convBackDate < currentDate) {
        const alphabets = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        const getNumber = await NumberInfo.find({"counter_info.name": name, "counter_info.type": type, "counter_info.year": `${year}`, created_at: {$gte: convBackDate, $lte: currentDate}}).sort({created_at: 1, "backIdentifier.alphabet": 1, }).limit(1);
        if (!getNumber.length) return res.status(404).json({message: "Please use the normal type"});
        if (getNumber.length && getNumber[0].backIdentifier) {
          const alphabetIndex = alphabets.indexOf(getNumber[0].backIdentifier.alphabet);
          if (alphabetIndex > 25) return res.status(400).json({message: "Maximum backdate quota has reached"});
          alphabet = alphabets[alphabetIndex + 1];
        } else {
          alphabet = alphabets[0];
        }
        numbering = {... await Counter.findOne(counterQuery).lean()};
        
        if (!getNumber[0].backIdentifier) getNumber[0].backIdentifier = {};
        getNumber[0].backIdentifier = {alphabet, backDate: convBackDate};

        docNumberCount = `${getNumber[0].serial_number}${alphabet}`;
        promise_all.push(getNumber[0].save());
      } else {
        numbering = await Counter.findOneAndUpdate(counterQuery, {$inc: {count: 1}}, {new: true, upsert: true});
        docNumberCount = numbering.count
      }
      
      const convertedYear = `${year + 2}`;
      const docNumberYear = convertedYear.substring(convertedYear.length - 2);
      let docNumber = `${docNumberYear}/${docNumberCount}/Kpa`;
      if (uker) docNumber += `-${uker}/${type}`;
      else docNumber += `/${type}`;

      const newNumberInfo = new NumberInfo();
      newNumberInfo.created_at = currentDate;
      newNumberInfo.created_by = adminAuth;
      newNumberInfo.serial_number = numbering.count;
      newNumberInfo.directed_to = directed_to;
      newNumberInfo.regarding = regarding;
      newNumberInfo.pic_name = pic_name;
      newNumberInfo.doc_number = type === "KEP.GBI/KPa" ? `${docNumber}/${year}` : docNumber;
      newNumberInfo.isBackDate = isBackDate;
      newNumberInfo.counter_info = {...numbering};
      newNumberInfo.mail_to = mail_to;
      promise_all.push(newNumberInfo.save());

      await Promise.all(promise_all);

      if (isSendingEmail) {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSWORD
          }
        });
  
        const mailOptions = {
          from: process.env.NODEMAILER_EMAIL,
          to: mail_to,
          subject: "Pengambilan Nomor Dokumen",
          html: `
            <h3>Nomor Dokumen Berhasil Diambil!</h3>
            <p>Bapak/Ibu pegawai KPwBI NTT yang berbahagia,</p>
            <p>Nomor untuk dokumen ${type} adalah <strong>${newNumberInfo.doc_number}</strong></p>
            <p>Semoga hari anda menyenangkan.</p>
            <br><br>
            <p>Salam, </p>
            <p>Admin IT OJT</p>
          `
        };
  
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      }

      return res.status(201).json({
        message: "Document number successfully created",
        newNumberInfo
      });
    } catch (err) {
      console.error(err, "<<<< error in addDocNumber NumberController");
      return res.status(500).json({message: "Internal server error"});
    }
  }

  static async listDocNumber (req, res, next) {
    try {
      const adminAuth = await Admin.findOne({
        email: req.payload.email,
        deleted: {$ne: true}
      }, {_id: 1, full_name: 1, nip: 1, email: 1}).lean();

      if (!adminAuth) return res.status(403).json({message: "Forbidden"});

      const {page = 0, type, uker} = req.query;
      const dataLimit = 10;
      const filter = {deleted: {$ne: true}};
      if (type) filter["counter_info.type"] = type;
      if (uker) filter["counter_info.uker"] = uker;

      const promise_all = await Promise.all([
        NumberInfo.find(filter).sort("-_id").skip(dataLimit * page).limit(dataLimit).lean(),
        NumberInfo.countDocuments(filter)
      ]);

      const numberInfos = promise_all[0];
      const count = promise_all[1];
      const pages = Math.ceil(count / dataLimit);

      return res.status(200).json({
        message: "Here's the list of document numbers",
        numberInfos,
        pages
      });
    } catch (err) {
      console.error(err, "<<<< error in lisDocNumber NumberController");
      return res.status(500).json({message: "Internal server error"});
    }
  }
}

module.exports = NumberController;