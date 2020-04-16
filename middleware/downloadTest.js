const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./data/test",
  filename: function (req, file, cb) {
    cb(null, req.body.title);
  },
});

const downloadTest = multer({
  storage: storage,
}).single("testImage");

module.exports = downloadTest;
