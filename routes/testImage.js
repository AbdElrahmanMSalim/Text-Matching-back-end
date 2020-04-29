const _ = require("lodash");
const downloadTest = require("../middleware/downloadTest");
const { QuestionImage } = require("../models/questionImage");
const express = require("express");
const router = express.Router();
const { getAllImageScores } = require("./common/cosineSimilarity");
const callFlaskModel = require("./common/callFlaskModel");

router.post("/", downloadTest, async (req, res) => {
  if (!req.file) return res.status(400).send("The image file is required");

  let questions = await QuestionImage.find({}).select([
    "encoding",
    "originalImagePath",
  ]);

  let imageModelResponse;

  try {
    imageModelResponse = await callFlaskModel(req.file.path); //todo when deployed
    if (!imageModelResponse) {
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
    req.file.path
  );

  res.send({
    scores: scores,
  });
});

module.exports = router;
