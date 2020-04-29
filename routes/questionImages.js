const _ = require("lodash");
const { QuestionImage, validate } = require("../models/questionImage");
const download = require("../middleware/download");
const express = require("express");
const callMathPix = require("./common/callMathPix");
const callFlaskModel = require("./common/callFlaskModel");
const { getTextEncoding } = require("./common/callBertModel");

const router = express.Router();

router.post("/", download, async (req, res) => {
  if (!req.file) return res.status(400).send("The image file is required");

  let questionImage = await QuestionImage.findOne({ title: req.body.title });
  if (questionImage)
    return res.status(400).send("This file is already in the database.");

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let response;
  try {
    response = await callMathPix(req.file);
    if (response.data.error) {
      res.status(400);
      return res.send("Error from Mathpix API: " + response.data.error);
    }
  } catch (error) {
    console.error(error);
    res.status(400);
    return res.send(error);
  }

  let r;
  try {
    r = await callFlaskModel(req.file.path); //todo when deploying

    if (!r) {
      res.status(400);
      return res.send("Error from image similarity model");
    }
  } catch (error) {
    console.error(error);
    res.status(400);
    return res.send("Error from image similarity model");
  }

  let textEncoding;
  try {
    textEncoding = await getTextEncoding(response.data.text);

    if (!textEncoding) {
      res.status(400);
      return res.send("Error from get Text Encoding ");
    }
  } catch (error) {
    console.error(error);
    res.status(400);
    return res.send("Error from get Text Encoding ");
  }

  questionImage = new QuestionImage({
    title: req.body.title,
    originalImagePath: req.file.path,
    text: response.data.text,
    encoding: r.data.encoding,
    textEncoding: textEncoding,
  });

  await questionImage.save();

  res.send(questionImage);
});

module.exports = router;
