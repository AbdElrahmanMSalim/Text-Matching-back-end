function cosinesim(A, B) {
  var dotproduct = 0;
  var mA = 0;
  var mB = 0;
  for (i = 0; i < A.length; i++) {
    dotproduct += A[i] * B[i];
    mA += A[i] * A[i];
    mB += B[i] * B[i];
  }

  mA = Math.sqrt(mA);
  mB = Math.sqrt(mB);
  var similarity = dotproduct / (mA * mB);
  return similarity;
}

module.exports = function getAllScores(x, y, questions) {
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
};

module.exports = function getAllImageScores(x, y, questions, testImagePath) {
  const scores = [];

  for (const el of x) {
    scores.push({
      similarity: (cosinesim(el.encoding, y) * 100).toString().slice(0, 5),
      image: el.originalImagePath,
      testImage: testImagePath,
    });
  }
  return scores;
};
