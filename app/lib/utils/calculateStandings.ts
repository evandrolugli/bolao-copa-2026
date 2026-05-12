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
  totalPredictions: number;

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
  day,
}: Props & { day?: number }): Standing[]{
  const standingsMap = new Map<number, Standing>();

  // 1. INIT PARTICIPANTS
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
      totalPredictions: 0,
      round1: 0,
      round2: 0,
      round3: 0,
      phase1: 0,
      phase2: 0,
    });
  }

  const publishedMatches = matches.filter(
    (m) => m.status === "publicar"
  );

  // get all available published days
  const availableDays = [
    ...new Set(publishedMatches.map((m) => m.day)),
  ];

  // latest published day
  const latestPublishedDay = Math.max(...availableDays);

  // decide effective day
  const effectiveDay =
    day !== undefined && availableDays.includes(day)
      ? day
      : latestPublishedDay;
      
  const filteredPublishedMatches = publishedMatches.filter(
    (m) => m.day === effectiveDay
  );

  // 2. MATCH LOOKUP MAP
  const matchMap = new Map<number, Match>();

  for (const match of filteredPublishedMatches) {
  matchMap.set(match.id, match);
}


  // 4. PROCESS PREDICTIONS
  for (const prediction of predictions) {
    const participant = standingsMap.get(prediction.participant_id);
    const match = matchMap.get(prediction.match_id);
    if (!match) continue;

    if (match.home_score == null || match.away_score == null) continue;

    //participant.totalPredictions++;

    const actualHome = match.home_score;
    const actualAway = match.away_score;

    const predictedHome = prediction.pred_home;
    const predictedAway = prediction.pred_away;

    const isExact =
      actualHome === predictedHome &&
      actualAway === predictedAway;

    const actualResult = Math.sign(
      actualHome - actualAway
    );

    const predictedResult = Math.sign(
      predictedHome - predictedAway
    );

    const isCorrectWinner =
      actualResult === predictedResult;

    let points = 0;

    if (isExact) {
      points = 3;
      participant.exactHits++;
    } else if (isCorrectWinner) {
      points = 1;
      participant.correctWinner++;
    } else {
      participant.wrong++;
    }

    participant.points += points;

    // ROUND POINTS
    if (match.rodada === "R1") {
      participant.round1 += points;
    }

    if (match.rodada === "R2") {
      participant.round2 += points;
    }

    if (match.rodada === "R3") {
      participant.round3 += points;
    }

    // PHASE POINTS
    if (match.fase === "grupo") {
      participant.phase1 += points;
    }

    if (match.fase === "fase 2") {
      participant.phase2 += points;
    }

    // Brazil matches
    if (match.is_brazil) {
      participant.brazilPoints += points;
    }

    // effective day points
    if (match.day === effectiveDay) {
      participant.todayPoints += points;
    }
  }

  // 5. CONVERT TO ARRAY
  const standings = Array.from(standingsMap.values());

  // 6. SORT
  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;

    if (b.exactHits !== a.exactHits)
      return b.exactHits - a.exactHits;

    return a.nome.localeCompare(b.nome);
  });

  // 7. POSITIONING (WITH TIES)
  let position = 1;

  for (let i = 0; i < standings.length; i++) {
    const current = standings[i];
    const previous = standings[i - 1];

    if (
      previous &&
      previous.points === current.points
    ) {
      current.position = null;
    } else {
      current.position = position;
    }

    position++;
  }

  console.log("FILTER DAY RECEIVED:", day);

  return standings;
}