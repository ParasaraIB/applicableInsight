"use strict";

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
      }).lean();

      if (!adminAuth) return res.status(403).json({message: "Forbidden"});

      const {
        name,
        type,
        directed_to,
        regarding,
        pic_name,
        isBackDate,
        backDate
      } = req.body;

      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const convBackDate = new Date(backDate);

      let alphabet = "";
      let numbering = {};
      let docNumberCount = 0;
      const promise_all = [];
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
        numbering = {... await Counter.findOne({name, type, year}).lean()};
        
        if (!getNumber[0].backIdentifier) getNumber[0].backIdentifier = {};
        getNumber[0].backIdentifier = {alphabet, backDate: convBackDate};

        docNumberCount = `${getNumber[0].serial_number}${alphabet}`;
        promise_all.push(getNumber[0].save());
      } else {
        numbering = await Counter.findOneAndUpdate({name, type, year}, {$inc: {count: 1}}, {new: true, upsert: true});
        docNumberCount = numbering.count
      }
      
      const convertedYear = `${year + 2}`;
      const docNumberYear = convertedYear.substring(convertedYear.length - 2);
      const docNumber = `${docNumberYear}/${docNumberCount}/Kpa/${type}`;

      const newNumberInfo = new NumberInfo();
      newNumberInfo.created_at = currentDate;
      newNumberInfo.serial_number = numbering.count;
      newNumberInfo.directed_to = directed_to;
      newNumberInfo.regarding = regarding;
      newNumberInfo.pic_name = pic_name;
      newNumberInfo.doc_number = type === "KEP.GBI/KPa" ? `${docNumber}/${year}` : docNumber;
      newNumberInfo.counter_info = {...numbering};
      promise_all.push(newNumberInfo.save());

      await Promise.all(promise_all);

      return res.status(201).json({
        message: "Document number successfully created",
        newNumberInfo
      });
    } catch (err) {
      console.error(err, "<<<< error in addCounter CounterController");
      return res.status(500).json({message: "Internal server error"});
    }
  }
}

module.exports = NumberController;