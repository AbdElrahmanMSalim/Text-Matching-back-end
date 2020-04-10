const Joi = require("joi");
const mongoose = require("mongoose");

const questionImageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  originalImagePath: {
    type: String,
    unique: true,
  },
  cutImagePath: {
    type: String,
    default: "",
  },
  text: {
    type: String,
    required: true,
  },
});

const QuestionImage = mongoose.model("QuestionImage", questionImageSchema);

function validateQuestionImage(questionImage) {
  const schema = {
    title: Joi.string().required(),
  };

  return Joi.validate(questionImage, schema);
}

exports.QuestionImage = QuestionImage;
exports.validate = validateQuestionImage;
