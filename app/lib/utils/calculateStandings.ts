import type {
  Participant,
  Match,
  Prediction,
} from "../utils/types";

type Standing = Participant & {
  position: number | null;

  points: number;
  exactHits: number;
  correctWinner: number;
  wrong: number;

  brazilPoints: number;
  todayPoints: number;
  positionChange: number;

  round1: number;
  round2: number;
  round3: number;

  phase1: number;
  phase2: number;
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

  for (const participant of participants) {
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

      round1: 0,
      round2: 0,
      round3: 0,

      phase1: 0,
      phase2: 0,
    });
  }

  // FILTER: Only published matches
  const publishedMatches = matches.filter(
    (m) => m.status === "publicar"
  );

  // GET: Latest day (for "todayPoints")
  const effectiveDay = publishedMatches.length
    ? Math.max(...publishedMatches.map((m) => m.day))
    : 0;

  // MATCH LOOKUP MAP (fast access by id)
  const matchMap = new Map<number, Match>();

  for (const match of publishedMatches) {
    matchMap.set(match.id, match);
  }

  // CALCULATE POINTS
  for (const prediction of predictions) {

    const participant = standingsMap.get(
      prediction.participant_id
    );

    const match = matchMap.get(prediction.match_id);

    if (!participant || !match) continue;

    // Skip matches without results yet
    if (match.home_score == null || match.away_score == null)
      continue;

    const actualHome = match.home_score;
    const actualAway = match.away_score;

    const predictedHome = prediction.pred_home;
    const predictedAway = prediction.pred_away;

    // Result comparison
    const isExact =
      actualHome === predictedHome &&
      actualAway === predictedAway;

    const actualResult = Math.sign(actualHome - actualAway);
    const predictedResult = Math.sign(predictedHome - predictedAway);

    const isCorrectWinner = actualResult === predictedResult;

    // Points logic
    let points = 0;

    if (isExact) {
      points = 5;
      participant.exactHits++;
    } else if (isCorrectWinner) {
      points = 2;
      participant.correctWinner++;
    } else {
      participant.wrong++;
    }

    participant.points += points;

    // Round breakdown
    if (match.round === "R1") participant.round1 += points;
    if (match.round === "R2") participant.round2 += points;
    if (match.round === "R3") participant.round3 += points;

    // Phase breakdown
    if (match.phase === "grupo") participant.phase1 += points;
    if (match.phase === "fase 2") participant.phase2 += points;

    // Special cases
    if (match.is_brazil) {
      participant.brazilPoints += points;
    }

    // Points for latest day only
    if (match.day === effectiveDay) {
      participant.todayPoints += points;
    }
  }

  // CONVERT MAP → ARRAY
  const standings = Array.from(standingsMap.values());

  // SORT (ranking logic)
  // standings.sort((a, b) => {
  //   if (b.points !== a.points) return b.points - a.points;
  //   if (b.exactHits !== a.exactHits) return b.exactHits - a.exactHits;
  //   return a.name.localeCompare(b.name);
  // });
  
  standings.sort((a, b) => {
    // 1. Total points
    if (b.points !== a.points) {
      return b.points - a.points;
    }

    // 2. Exact hits (tie-break)
    if (b.exactHits !== a.exactHits) {
      return b.exactHits - a.exactHits;
    }

    // 3. Brazil points (tie-break)
    if (b.brazilPoints !== a.brazilPoints) {
      return b.brazilPoints - a.brazilPoints;
    }

    // 4. Alphabetical order
    return a.name.localeCompare(b.name);
  });

  // POSITION (handle ties)
  let position = 1;

  for (let i = 0; i < standings.length; i++) {
    const current = standings[i];
    const previous = standings[i - 1];

    if (previous && previous.points === current.points) {
      current.position = null; // tie
    } else {
      current.position = position;
    }

    position++;
  }

  return standings;
}
