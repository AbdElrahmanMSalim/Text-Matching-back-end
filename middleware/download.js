const multer = require("multer");

const storage = multer.diskStorage({
  destination: "data/original",
  filename: function (req, file, cb) {
    cb(null, req.body.title);
  },
});

const download = multer({
  storage: storage,
}).single("image");

module.exports = download;
