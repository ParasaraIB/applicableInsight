"use strict";

const NumberRouter = require("express").Router();

const authentication = require("../middlewares/auth");
const NumberController = require("../controllers/NumberController");

NumberRouter.get("/", NumberController.testLive);
NumberRouter.post("/addDocNumber", authentication, NumberController.addDocNumber);
NumberRouter.get("/listDocNumber", authentication, NumberController.listDocNumber);
NumberRouter.get("/downloadDocNumber", authentication, NumberController.downloadDocNumber);
NumberRouter.get("/detailDocNumber", authentication, NumberController.detailDocNumber);
NumberRouter.put("/editDocNumber", authentication, NumberController.editDocNumber);
NumberRouter.get("/listDocType", authentication, NumberController.listDocType);
NumberRouter.delete("/deleteDocNumber", authentication, NumberController.deleteDocNumber);
NumberRouter.get("/listUker", authentication, NumberController.listUker);
NumberRouter.post("/uploadToOneDrive", authentication, NumberController.uploadToOneDrive);
NumberRouter.delete("/deleteOnOneDrive", authentication, NumberController.deleteOnOneDrive);
NumberRouter.get("/listDocCounter", authentication, NumberController.listDocCounter);

module.exports = NumberRouter;