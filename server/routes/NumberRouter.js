"use strict";

const NumberRouter = require("express").Router();

const authentication = require("../middlewares/auth");
const NumberController = require("../controllers/NumberController");

NumberRouter.post("/addDocNumber", authentication, NumberController.addDocNumber);

module.exports = NumberRouter;