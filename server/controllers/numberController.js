"use strict";

const {
  Counter,
  NumberInfo
} = require("../models");

class numberController {
  static async addDocNumber (req, res, next) {
    try {
      const {
        // email,
        name,
        type,
        directed_to,
        regarding,
        pic_name,
      } = req.body;

      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const numbering = await Counter.findOneAndUpdate({name, type, year}, {$inc: {count: 1}}, {new: true, upsert: true});
      
      const convertedYear = `${year + 2}`;
      const docNumberYear = convertedYear.substring(convertedYear.length - 2);
      const docNumber = `${docNumberYear}/${numbering.count}/Kpa/${type}`;

      const newNumberInfo = new NumberInfo();
      newNumberInfo.created_at = currentDate;
      newNumberInfo.serial_number = numbering.count;
      newNumberInfo.directed_to = directed_to;
      newNumberInfo.regarding = regarding;
      newNumberInfo.pic_name = pic_name;
      newNumberInfo.doc_number = type === "KEP.GBI/KPa" ? `${docNumber}/${year}` : docNumber;
      await newNumberInfo.save();

      return res.status(201).json({
        message: "Document number successfully created",
        newNumberInfo
      });
    } catch (err) {
      console.error(err, "<<<< error in addCounter CounterController");
    }
  }
}

module.exports = numberController;