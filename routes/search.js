const express = require("express");
const router = express.Router();
const { QuestionImage } = require("../models/questionImage");

router.get("/", async (req, res) => {
  let questions = await QuestionImage.find({}).select([
    "text",
    "originalImagePath",
  ]);

  res.send(questions);
});

module.exports = router;
