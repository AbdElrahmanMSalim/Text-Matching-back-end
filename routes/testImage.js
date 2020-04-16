const _ = require("lodash");
const downloadTest = require("../middleware/downloadTest");
const { QuestionImage } = require("../models/questionImage");
const express = require("express");
const router = express.Router();
const callMathPix = require("./common/callMathPix");
const callBertModel = require("./common/callBertModel");

router.post("/", downloadTest, async (req, res) => {
  if (!req.file) return res.status(400).send("The image file is required");

  let questions = await QuestionImage.find({}).select([
    "text",
    "originalImagePath",
  ]);

  let mathPixResponse, bertModelResponse;

  try {
    mathPixResponse = await callMathPix(req.file);
  } catch (error) {
    res.status(400);
    return res.send("Failed in mathpix part: " + error);
  }

  try {
    bertModelResponse = await callBertModel(
      questions,
      mathPixResponse.data.text
    );
    res.send({
      extractedText: mathPixResponse.data.text,
      scores: bertModelResponse,
    });
  } catch (error) {
    res.status(400);
    res.send("Failed in bertmodel: " + error);
  }
});

module.exports = router;
