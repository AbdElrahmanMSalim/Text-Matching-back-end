const base64Img = require("base64-img");
const axios = require("axios");

module.exports = async function callMathPix(file) {
  image_uri = base64Img.base64Sync(file.path, "rb");

  const response = await axios.post(
    "https://api.mathpix.com/v3/text",
    JSON.stringify({
      src: image_uri,
      formats: ["text"],
    }),
    {
      headers: {
        app_id: "nlytn_in_gmail_com_9dfc0b",
        app_key: "82c404485ab9c2a0ceed",
        "Content-type": "application/json",
      },
    }
  );

  return response;
};
