export function getPredictionPoints(
  actualHome: number,
  actualAway: number,
  predictedHome: number,
  predictedAway: number
) {
  const exact =
    actualHome === predictedHome &&
    actualAway === predictedAway;

  const actualResult = Math.sign(
    actualHome - actualAway
  );

  const predictedResult = Math.sign(
    predictedHome - predictedAway
  );

  const correctWinner =
    actualResult === predictedResult;

  if (exact) {
    return {
      points: 3,
      exact: true,
      correctWinner: false,
    };
  }

  if (correctWinner) {
    return {
      points: 1,
      exact: false,
      correctWinner: true,
    };
  }

  return {
    points: 0,
    exact: false,
    correctWinner: false,
  };
}