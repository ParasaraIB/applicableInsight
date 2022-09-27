"use strict";

const numberRouter = require("express").Router();
const numberController = require("../controllers/numberController");

numberRouter.post("/addDocNumber", numberController.addCounter);

module.exports = numberRouter;