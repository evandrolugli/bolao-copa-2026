import { POINTS } from "./constants";

function calculatePoints(match, prediction) {
	const isExact =
		match.home_score === prediction.pred_home &&
		match.away_score === prediction.pred_away;

	const actual = Math.sign(match.home_score - match.away_score);
	const predicted = Math.sign(prediction.pred_home - prediction.pred_away);

	const isCorrect = actual === predicted;

	if (isExact) return { points: POINTS.exactHits, type: "exact" };
	if (isCorrect) return { points: POINTS.correctHits, type: "correct" };

	return { points: 0, type: "wrong" };
}

export function calculatePredictionPoints({
	leaderboard,
	predictions,
	matchMap,
	effectiveDay,
}) {
	for (const pred of predictions) {
		const entry = leaderboard.find((l) => l.id === pred.participant_id);

		const match = matchMap.get(pred.match_id);

		if (!entry || !match) continue;
		if (match.home_score == null || match.away_score == null) continue;

		const { points, type } = calculatePoints(match, pred);

		entry.points += points;

		if (type === "exact") entry.exactHits++;
		else if (type === "correct") entry.correctWinner++;
		else entry.wrong++;

		if (match.is_brazil) entry.brazilPoints += points;
		if (match.day === effectiveDay) entry.todayPoints += points;

		if (match.round === "R1") entry.round1 += points;
		if (match.round === "R2") entry.round2 += points;
		if (match.round === "R3") entry.round3 += points;

		if (match.phase === "grupo") entry.phase1 += points;
		if (match.phase === "fase 2") entry.phase2 += points;
	}
}
