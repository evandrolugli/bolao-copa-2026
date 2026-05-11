import type {
  Participant,
  Match,
  Prediction,
} from "@/lib/types";

type Standing = Participant & {
  position: number | null;
  points: number;
  exactHits: number;
  correctWinner: number;
  wrong: number;
  brazilPoints: number;
  todayPoints: number;
  positionChange: number;
  totalPredictions: number;
};

type Props = {
  participants: Participant[];
  matches: Match[];
  predictions: Prediction[];
};

export function calculateStandings({
  participants,
  matches,
  predictions,
}: Props): Standing[] {
  const standingsMap = new Map<number, Standing>();

  // Create participants
  participants.forEach((participant) => {
    standingsMap.set(participant.id, {
      ...participant,

      position: null,
      points: 0,
      exactHits: 0,
      correctWinner: 0,
      wrong: 0,
      brazilPoints: 0,
      todayPoints: 0,
      positionChange: 0,
      totalPredictions: 0,
    });
  });

  // Match lookup
  const matchesMap = new Map<number, Match>();

  matches.forEach((match) => {
    matchesMap.set(match.id, match);
  });

  // Latest published day
  const publishedMatches = matches.filter(
    (match) => match.status === "publicar"
  );

  const latestDay = Math.max(
    ...publishedMatches.map((match) => match.day)
  );

  // Process predictions
  predictions.forEach((prediction) => {
    const participant = standingsMap.get(
      prediction.participant_id
    );

    const match = matchesMap.get(prediction.match_id);

    if (!participant || !match) return;

    // ONLY published matches
    if (match.status !== "publicar") return;

    // Ignore unfinished matches
    if (
      match.home_score === null ||
      match.away_score === null
    ) {
      return;
    }

    participant.totalPredictions++;

    const actualHome = match.home_score;
    const actualAway = match.away_score;

    const predictedHome = prediction.pred_home;
    const predictedAway = prediction.pred_away;

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

    let earnedPoints = 0;

    if (exact) {
      earnedPoints = 3;

      participant.exactHits++;
    } else if (correctWinner) {
      earnedPoints = 1;

      participant.correctWinner++;
    } else {
      participant.wrong++;
    }

    participant.points += earnedPoints;

    // Brazil matches
    if (match.is_brazil) {
      participant.brazilPoints += earnedPoints;
    }

    // Latest day points
    if (match.day === latestDay) {
      participant.todayPoints += earnedPoints;
    }
  });

  // Convert to array
  const standings = Array.from(
    standingsMap.values()
  );

  // Sort
  standings.sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }

    if (b.exactHits !== a.exactHits) {
      return b.exactHits - a.exactHits;
    }

    return a.nome.localeCompare(b.nome);
  });

  // Position with ties
  let currentPosition = 1;

  standings.forEach((participant, index) => {
    const previous = standings[index - 1];

    if (
      previous &&
      previous.points === participant.points
    ) {
      participant.position = null;
    } else {
      participant.position = currentPosition;
    }

    currentPosition++;
  });

  return standings;
}