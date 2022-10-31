"use strict";

const AdminRouter = require("express").Router();

const authentication = require("../middlewares/auth");
const AdminController = require("../controllers/AdminController");

AdminRouter.post("/adminLogin", AdminController.adminLogin);
AdminRouter.post("/addAdmin", authentication, AdminController.addAdmin);

module.exports = AdminRouter;