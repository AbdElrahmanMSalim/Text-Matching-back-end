const _ = require("lodash");
const downloadTest = require("../middleware/downloadTest");
const { QuestionImage } = require("../models/questionImage");
const express = require("express");
const router = express.Router();
const getAllImageScores = require("./common/cosineSimilarity");
const callFlaskModel = require("./common/callFlaskModel");

router.post("/", downloadTest, async (req, res) => {
  if (!req.file) return res.status(400).send("The image file is required");
  console.log(req.file)
  let questions = await QuestionImage.find({}).select([
    "encoding",
    "originalImagePath",
  ]);

  let imageModelResponse;

  try {
    mathPixResponse = await callMathPix(req.file);

    if (mathPixResponse.data.error) {
      console.log("mathPixResponse.data.error");
      console.log(mathPixResponse.data.error);
      res.status(400);
      return res.send("Error from image similarity model");
    }
  } catch (error) {
    console.error(error);
    res.status(400);
    return res.send("Error from image similarity model");
  }

  // send top ten
  const scores = getAllImageScores(
    questions,
    imageModelResponse.data.encoding,
    questions,
    req.file.path
  );

  console.log(scores);

  res.send({
    scores: scores,
  });
});

module.exports = router;
