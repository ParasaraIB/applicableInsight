"use strict";

const nodemailer = require("nodemailer");
const ExcelJS = require("exceljs");

const {
  Counter,
  NumberInfo,
  Admin,
  DocType,
  Uker
} = require("../models");

function toDecimal(str) {
  let decimal = 0;
  let letters = str.split(new RegExp());

  for(let i = letters.length - 1; i >= 0; i--) {
    decimal += (letters[i].charCodeAt(0) - 64) * (Math.pow(26, letters.length - (i + 1)));
  }

  return decimal;
}

function convertToNumberingScheme(number) {
  let baseChar = ("A").charCodeAt(0);
  let letters  = "";

  do {
    number -= 1;
    letters = String.fromCharCode(baseChar + (number % 26)) + letters;
    number = (number / 26) >> 0;
  } while(number > 0);

  return letters;
}

class NumberController {
  static async addDocNumber (req, res, next) {
    try {
      const adminAuth = await Admin.findOne({
        email: req.payload.email,
        deleted: {$ne: true}
      }, {_id: 1, full_name: 1, nip: 1, email: 1}).lean();

      if (!adminAuth) return res.status(403).json({message: "Forbidden"});

      const isSendingEmail = true;

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

      if (
        !name ||
        !type ||
        !directed_to ||
        !regarding ||
        !pic_name ||
        (isBackDate && !backDate)
      ) return res.status(400).json({message: "Isilah data dengan lengkap!"});

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
        const getNumber = await NumberInfo.find({"counter_info.name": name, "counter_info.type": type, "counter_info.year": `${year}`, created_at: {$gte: convBackDate, $lte: currentDate}}).sort({created_at: 1}).limit(1);
        if (!getNumber.length) return res.status(404).json({message: "Gunakan jenis penomoran normal"});
        if (getNumber.length && getNumber[0].backIdentifier) {
          const alphabetIndex = toDecimal(getNumber[0].backIdentifier.alphabet);
          alphabet = convertToNumberingScheme(alphabetIndex + 1);
        } else {
          alphabet = "A"
        }
        numbering = {... await Counter.findOne(counterQuery).lean()};
        
        if (!getNumber[0].backIdentifier) getNumber[0].backIdentifier = {};
        getNumber[0].backIdentifier = {alphabet, backDate: convBackDate};

        docNumberCount = `${getNumber[0].serial_number}${alphabet}`;
        promise_all.push(getNumber[0].save());
      } else {
        const checkDeletedNumber = await Counter.findOne({...counterQuery, deletedNumber: { $exists: true, $ne: [] }});
        if (checkDeletedNumber) {
          numbering = checkDeletedNumber;
          docNumberCount = numbering.deletedNumber[0];
          checkDeletedNumber.deletedNumber.shift();
          checkDeletedNumber.markModified("deletedNumber");
          promise_all.push(checkDeletedNumber.save());
        } else {
          numbering = await Counter.findOneAndUpdate(counterQuery, {$inc: {count: 1}}, {new: true, upsert: true});
          docNumberCount = numbering.count;
        }
      }
      
      const convertedYear = `${year + 2}`;
      const docNumberYear = convertedYear.substring(convertedYear.length - 2);
      let docNumber = `${docNumberYear}/${docNumberCount}/Kpa`;
      if (uker) docNumber += `-${uker}/${type}`;
      else docNumber += `/${type}`;

      const newNumberInfo = new NumberInfo();
      newNumberInfo.created_at = currentDate;
      newNumberInfo.created_by = adminAuth;
      newNumberInfo.serial_number = numbering.deletedNumber && numbering.deletedNumber.length ? numbering.deletedNumber[0] : numbering.count;
      newNumberInfo.directed_to = directed_to;
      newNumberInfo.regarding = regarding;
      newNumberInfo.pic_name = pic_name;
      newNumberInfo.doc_number = type === "KEP.GBI/KPa" ? `${docNumber}/${year}` : docNumber;
      newNumberInfo.isBackDate = isBackDate;
      newNumberInfo.counter_info = {...numbering};
      newNumberInfo.mail_to = mail_to;
      promise_all.push(newNumberInfo.save());

      await Promise.all(promise_all);

      if (isSendingEmail && mail_to) {
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
            <p>Nomor untuk dokumen ${type} anda adalah <strong>${newNumberInfo.doc_number}</strong></p>
            <p>Semoga hari anda menyenangkan.</p>
            <br><br>
            <p>Salam, </p>
            <p>Ida Bagus (18176) - IT OJT</p>
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
        message: "Nomor dokumen berhasil diambil",
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

      const currentDate = new Date();
      const currentYearDate = new Date(currentDate.getFullYear().toString());

      const {page = 0, search = "", type, uker} = req.query;
      const dataLimit = 10;
      const filter = {deleted: {$ne: true}, created_at: {$gte: currentYearDate}};
      if (type) filter["counter_info.type"] = type;
      if (uker) filter["counter_info.uker"] = uker;
      if (search) {
        const reg = new RegExp(search, "i");
        filter.$or = [
          {regarding: reg},
          {directed_to: reg}
        ];
      }

      const promise_all = await Promise.all([
        NumberInfo.find(filter).sort("-created_at").skip(dataLimit * page).limit(dataLimit).lean(),
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

  static async downloadDocNumber (req, res, next) {
    try {
      const currentDate = new Date();
      const currentYearDate = new Date(currentDate.getFullYear().toString());
      const retunredValue = {_id: 1, serial_number: 1, directed_to: 1, regarding: 1, pic_name: 1, doc_number: 1, isBackDate: 1, counter_info: 1, created_at: 1};
      const numberInfos = await NumberInfo.find({created_at: {$gte: currentYearDate}}, retunredValue).sort("-_id").lean();
      const allTypes = await Counter.find().lean();
      const workbook = new ExcelJS.Workbook();
      for (let i = 0; i < allTypes.length; i++) {
        const worksheetName = `${allTypes[i].type} ${allTypes[i].uker ? allTypes[i].uker : ""}`;
        const adjName = worksheetName.replace("/", " ");
        const worksheet = workbook.addWorksheet(adjName);
        worksheet.columns = [
          {header: "Id", key: "_id"},
          {header: "Serial number", key: "serial_number"},
          {header: "Created at", key: "created_at"},
          {header: "Directed to", key: "directed_to"},
          {header: "Regarding", key: "regarding"},
          {header: "Doc number", key: "doc_number"},
          {header: "Back date", key: "isBackDate"},
          {header: "Pic name", key: "pic_name"},
        ];
        const fillers = [];
        for (let j = 0; j < numberInfos.length; j++) {
          if (allTypes[i].uker && numberInfos[j].counter_info.uker && allTypes[i].uker === numberInfos[j].counter_info.uker && allTypes[i].type === numberInfos[j].counter_info.type) {
            fillers.push(numberInfos[j]);
          } else if (allTypes[i].type === numberInfos[j].counter_info.type && !allTypes[i].uker) {
            fillers.push(numberInfos[j]);
          }
        } 
        worksheet.addRows(fillers);
      }
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + `${currentDate.toISOString().split('T')[0].replaceAll("-", "")}RekapPengambilanNomor.xlsx`
      );
      await workbook.xlsx.write(res);
      return res.status(200).end();
    } catch (err) {
      console.error(err, "<<<< error in downloadDocNumber NumberController");
      return res.status(500).json({message: "Internal server error"});
    }
  }

  static async detailDocNumber (req, res, next) {
    try {
      const adminAuth = await Admin.findOne({
        email: req.payload.email,
        deleted: {$ne: true}
      }, {_id: 1, full_name: 1, nip: 1, email: 1}).lean();

      if (!adminAuth) return res.status(403).json({message: "Forbidden"});
      
      const {id} = req.query;
      const docNumber = await NumberInfo.findOne({_id: id, deleted: {$ne: true}}).lean();
      if (!docNumber) return res.status(404).json({message: "Document number not found"});

      return res.status(200).json({
        message: "Here's the document number detail",
        docNumber
      });
    } catch (err) {
      console.error(err, "<<<< error in detailDocNumber NumberController");
      return res.status(500).json({message: "Internal server error"});
    }
  }

  static async editDocNumber (req, res, next) {
    try {
      const adminAuth = await Admin.findOne({
        email: req.payload.email,
        deleted: {$ne: true}
      }, {_id: 1, full_name: 1, nip: 1, email: 1}).lean();

      if (!adminAuth) return res.status(403).json({message: "Forbidden"});

      const {
        _id,
        directed_to,
        regarding,
        pic_name
      } = req.body;

      if (
        !directed_to ||
        !regarding ||
        !pic_name
      ) return res.status(400).json({message: "Isilah data dengan lengkap!"});

      const checkDocNumber = await NumberInfo.findOne({_id, deleted: {$ne: true}});
      if (!checkDocNumber) return res.status(404).json({message: "Document number not found"});
      
      const currentDate = new Date();
      
      checkDocNumber.directed_to = directed_to;
      checkDocNumber.regarding = regarding;
      checkDocNumber.pic_name = pic_name;
      checkDocNumber.edited_by.push({...adminAuth, edited_at: currentDate});
      checkDocNumber.markModified("edited_by");
      const editedDocNumber = await checkDocNumber.save();

      return res.status(200).json({
        message: "Info nomor dokumen berhasil diedit",
        editedDocNumber
      });
    } catch (err) {
      console.error (err, "<<<< error in editDocNumber NumberController");
      return res.status(500).json({message: "Internal server error"});
    }
  }

  static async deleteDocNumber (req, res, next) {
    try {
      const adminAuth = await Admin.findOne({
        email: req.payload.email,
        deleted: {$ne: true}
      }, {_id: 1, full_name: 1, nip: 1, email: 1}).lean();

      if (!adminAuth) return res.status(403).json({message: "Forbidden"});

      const {_id} = req.body;
      const currentDate = new Date();

      const docNumber = await NumberInfo.findOneAndUpdate(
        {_id, deleted: {$ne: true}},
        {
          $set: {
            deleted: true,
            deleted_by: {...adminAuth, deleted_at: currentDate}
          }
        },
        {new: true}
      ).lean();
      if (!docNumber) return res.status(404).json({message: "Document number not found or already deleted"});

      if (!docNumber.isBackDate) await Counter.updateOne({_id: docNumber.counter_info._id}, {$push: {deletedNumber: docNumber.serial_number}});

      return res.status(200).json({
        message: "Nomor dokumen berhasil dihapus",
        docNumber
      });
    } catch (err) {
      console.error(err, "<<<< error in deleteDocNumber NumberController");
      return res.status(500).json({message: "Internal server error"});
    }
  }

  static async listDocType (req, res, next) {
    try {
      const adminAuth = await Admin.findOne({
        email: req.payload.email,
        deleted: {$ne: true}
      }, {_id: 1, full_name: 1, nip: 1, email: 1}).lean();

      if (!adminAuth) return res.status(403).json({message: "Forbidden"});

      const docTypes = await DocType.find({}, {name: 1, type: 1}).lean();
      return res.status(200).json({
        message: "Here's the document types",
        docTypes
      });
    } catch (err) {
      console.error(err, "<<<< error in listDoctype NumberController");
      return res.status(500).json({message: "Internal server error"});
    }
  }

  static async listUker (req, res, next) {
    try { 
      const adminAuth = await Admin.findOne({
        email: req.payload.email,
        deleted: {$ne: true}
      }, {_id: 1, full_name: 1, nip: 1, email: 1}).lean();

      if (!adminAuth) return res.status(403).json({message: "Forbidden"});

      const ukers = await Uker.find({}, {name: 1, abbreviation: 1}).lean();
      return res.status(200).json({
        message: "Here's the list of uker",
        ukers
      });
    } catch (err) {
      console.error(err, "<<<< error in listUker NumberController");
      return res.status(500).json({message: "Internal server error"});
    }
  }
}

module.exports = NumberController;