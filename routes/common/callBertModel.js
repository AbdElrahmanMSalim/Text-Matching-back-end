const axios = require("axios");
const { getAllScores } = require("./cosineSimilarity");

exports.callBertModel = async function callBertModel(questions, query) {
  const questionsData = {
    id: 1,
    texts: questions.map((el) => el.text),
  };

  const questionsResponse = await axios.post(
    "http://139.59.68.43:8125/encode",
    questionsData
  );

  const queryData = {
    id: 2,
    texts: [query],
  };
  const queryResponse = await axios.post(
    "http://139.59.68.43:8125/encode",
    queryData
  );

  const x = questionsResponse.data.result;
  const y = queryResponse.data.result;
  const scores = getAllScores(x, y, questions);

  return scores;
};

exports.getTextEncoding = async function getTextEncoding(query) {
  const queryData = {
    id: Math.floor(Math.random() * 1000),
    texts: [query],
  };
  console.log(queryData);

  const queryResponse = await axios.post(
    "http://139.59.68.43:8125/encode",
    queryData
  );
  console.log(queryResponse.data.result[0][0]);

  return queryResponse.data.result[0];
};
