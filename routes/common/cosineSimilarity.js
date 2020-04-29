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

exports.getAllScores = function getAllScores(x, y) {
  const scores = [];
  for (const el of x) {
    scores.push({
      question: el.text,
      similarity: (cosinesim(el.textEncoding, y) * 100).toString().slice(0, 5),
      image: el.originalImagePath,
    });
  }
  return scores;
};

exports.getAllImageScores = function getAllImageScores(x, y, testImagePath) {
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
