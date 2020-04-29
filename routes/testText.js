const _ = require("lodash");
const downloadTest = require("../middleware/downloadTest");
const { QuestionImage } = require("../models/questionImage");
const express = require("express");
const router = express.Router();
const callMathPix = require("./common/callMathPix");
const { getTextEncoding } = require("./common/callBertModel");
const { getAllScores } = require("./common/cosineSimilarity");

router.post("/", downloadTest, async (req, res) => {
  if (!req.file) return res.status(400).send("The image file is required");
  let questions = await QuestionImage.find({}).select([
    "text",
    "textEncoding",
    "originalImagePath",
  ]);

  let mathPixResponse;
  try {
    mathPixResponse = await callMathPix(req.file);
    if (mathPixResponse.data.error) {
      console.log("mathPixResponse.data.error");
      console.log(mathPixResponse.data.error);
      res.status(400);
      return res.send("Failed in mathpix part: " + mathPixResponse.data.error);
    }
  } catch (error) {
    res.status(400);
    return res.send("Failed in mathpix part: " + error);
  }

  let textEncoding;
  try {
    textEncoding = await getTextEncoding(mathPixResponse.data.text);
    if (!textEncoding) {
      res.status(400);
      return res.send("Error from get Text Encoding ");
    }
  } catch (error) {
    console.error(error);
    res.status(400);
    return res.send("Error from get Text Encoding ");
  }

  const scores = getAllScores(questions, textEncoding);

  res.send({
    extractedText: mathPixResponse.data.text,
    scores: scores,
  });
});

module.exports = router;
