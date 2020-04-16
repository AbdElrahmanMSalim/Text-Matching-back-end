const axios = require("axios");

function cosinesim(A, B) {
  var dotproduct = 0;
  var mA = 0;
  var mB = 0;
  for (i = 0; i < A.length; i++) {
    // here you missed the i++
    dotproduct += A[i] * B[i];
    mA += A[i] * A[i];
    mB += B[i] * B[i];
  }

  mA = Math.sqrt(mA);
  mB = Math.sqrt(mB);
  var similarity = dotproduct / (mA * mB); // here you needed extra brackets
  return similarity;
}

function getAllScores(x, y, questions) {
  const scores = [];
  let cnt = 0;
  for (const el of x) {
    scores.push({
      question: questions[cnt].text,
      similarity: (cosinesim(el, y[0]) * 100).toString().slice(0, 5),
      image: questions[cnt].originalImagePath,
    });
    cnt += 1;
  }
  return scores;
}

module.exports = async function callBertModel(questions, query) {
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
