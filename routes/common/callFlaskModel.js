const axios = require("axios");

module.exports = async function callFlaskModel(path) {
  const response = await axios.post("http://localhost:5000/encode", { path });
  return response;
};
