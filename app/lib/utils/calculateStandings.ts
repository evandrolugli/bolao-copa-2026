import type { Match, Participant, Prediction } from "../utils/types";

type Standing = Participant & {
	position: number | null;

	points: number;
	exactHits: number;
	correctWinner: number;
	wrong: number;

	brazilPoints: number;
	todayPoints: number;
	previousPosition: number | null;
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

function sortStandings(standings: Standing[]) {
	standings.sort((a, b) => {
		// 1. Total points
		if (b.points !== a.points) {
			return b.points - a.points;
		}

		// 2. Exact hits
		if (b.exactHits !== a.exactHits) {
			return b.exactHits - a.exactHits;
		}

		// 3. Brazil points
		if (b.brazilPoints !== a.brazilPoints) {
			return b.brazilPoints - a.brazilPoints;
		}

		// 4. Alphabetical
		return a.name.localeCompare(b.name);
	});
}

function applyPositions(standings: Standing[]) {
	let position = 1;

	for (let i = 0; i < standings.length; i++) {
		const current = standings[i];
		const previous = standings[i - 1];

		const isTie =
			previous &&
			previous.points === current.points &&
			previous.exactHits === current.exactHits &&
			previous.brazilPoints === current.brazilPoints;

		if (isTie) {
			current.position = previous.position;
		} else {
			current.position = position;
		}

		position++;
	}
}

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
			previousPosition: null,
			positionChange: 0,

			round1: 0,
			round2: 0,
			round3: 0,

			phase1: 0,
			phase2: 0,
		});
	}

	// FILTER: Only published matches
	const publishedMatches = matches.filter((m) => m.status === "publicar");

	// GET: Latest day (for "todayPoints")
	const effectiveDay = publishedMatches.length
		? Math.max(...publishedMatches.map((m) => m.day))
		: 0;

	const hasPreviousDay = effectiveDay > 1;

	// MATCH LOOKUP MAP (fast access by id)
	const matchMap = new Map<number, Match>();

	for (const match of publishedMatches) {
		matchMap.set(match.id, match);
	}

	// CALCULATE POINTS
	for (const prediction of predictions) {
		const participant = standingsMap.get(prediction.participant_id);

		const match = matchMap.get(prediction.match_id);

		if (!participant || !match) continue;

		// Skip matches without results yet
		if (match.home_score == null || match.away_score == null) continue;

		const actualHome = match.home_score;
		const actualAway = match.away_score;

		const predictedHome = prediction.pred_home;
		const predictedAway = prediction.pred_away;

		// Result comparison
		const isExact =
			actualHome === predictedHome && actualAway === predictedAway;

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

	// Sort + Positions
	sortStandings(standings);
	applyPositions(standings);

	// PREVIOUS STANDINGS

	if (hasPreviousDay) {
		const previousStandingsMap = new Map<number, Standing>();

		for (const participant of participants) {
			previousStandingsMap.set(participant.id, {
				...participant,

				position: null,
				previousPosition: null,

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

		// CALCULATE PREVIOUS RANKING
		for (const prediction of predictions) {
			const participant = previousStandingsMap.get(prediction.participant_id);

			const match = matchMap.get(prediction.match_id);

			if (!participant || !match) continue;

			// IGNORE CURRENT DAY
			if (match.day >= effectiveDay) continue;

			if (match.home_score == null || match.away_score == null) continue;

			const actualHome = match.home_score;
			const actualAway = match.away_score;

			const predictedHome = prediction.pred_home;
			const predictedAway = prediction.pred_away;

			const isExact =
				actualHome === predictedHome && actualAway === predictedAway;

			const actualResult = Math.sign(actualHome - actualAway);
			const predictedResult = Math.sign(predictedHome - predictedAway);

			const isCorrectWinner = actualResult === predictedResult;

			let points = 0;

			if (isExact) {
				points = 5;
				participant.exactHits++;
			} else if (isCorrectWinner) {
				points = 2;
				participant.correctWinner++;
			}

			participant.points += points;

			if (match.is_brazil) {
				participant.brazilPoints += points;
			}
		}

		const previousStandings = Array.from(previousStandingsMap.values());

		sortStandings(previousStandings);
		applyPositions(previousStandings);

		// SAVE PREVIOUS POSITIONS
		const previousPositionMap = new Map<number, number | null>();

		for (const standing of previousStandings) {
			previousPositionMap.set(standing.id, standing.position);
		}

		// CALCULATE POSITION CHANGE
		for (const standing of standings) {
			const previousPosition = previousPositionMap.get(standing.id);

			standing.previousPosition = previousPosition ?? null;

			if (previousPosition != null && standing.position != null) {
				standing.positionChange = previousPosition - standing.position;
			}
		}
	}
	return standings;
}
