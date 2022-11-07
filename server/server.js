"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const mongooseConnect = require("./config/mongoose");
const NumberRouter = require("./routes/NumberRouter");
const AdminRouter = require("./routes/AdminRouter");

const server = express();
const PORT = process.env.PORT || 3000;

// Body parser
server.use(express.json());
server.use(express.urlencoded({extended: false}));

// Cors
server.use(cors());

mongooseConnect();

// Number Routes
server.use("/number", NumberRouter);
// Admin Routes
server.use("/admin", AdminRouter);

server.listen(PORT, () => {
  console.log(`applicableInsight server listening at http://localhost:${PORT}`);
});