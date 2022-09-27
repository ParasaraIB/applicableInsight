"use strict";

const express = require("express");
const server = express();
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`applicableInsight server listening at http://localhost:${PORT}`);
});
