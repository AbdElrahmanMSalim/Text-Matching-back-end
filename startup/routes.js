const express = require("express");
const questionImages = require("../routes/questionImages");
const testImage = require("../routes/testImage");
const error = require("../middleware/error");
var cors = require("cors");

module.exports = function (app) {
  app.use(cors());
  app.use(express.json());
  app.use("/api/testImage", testImage);
  app.use("/api/questionImages", questionImages);
  app.use(error);
};
