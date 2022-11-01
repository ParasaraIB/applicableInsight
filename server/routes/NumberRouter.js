"use strict";

const NumberRouter = require("express").Router();

const authentication = require("../middlewares/auth");
const NumberController = require("../controllers/NumberController");

NumberRouter.post("/addDocNumber", authentication, NumberController.addDocNumber);
NumberRouter.get("/listDocNumber", authentication, NumberController.listDocNumber);
NumberRouter.get("/downloadDocNumber", NumberController.downloadDocNumber);

module.exports = NumberRouter;