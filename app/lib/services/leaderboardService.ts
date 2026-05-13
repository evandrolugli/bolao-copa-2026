import { fetchSheet } from "../googleSheets/fetchSheet";
import { SHEETS } from "../googleSheets/sheetsConfig";
import { calculateLeaderboard } from "../utils/calculateLeaderboard";
import { MATCH_STATUS } from "../utils/constants";
import type { Match, Participant, Prediction } from "../utils/types";

export async function getLeaderboard() {
	// fetch all required data in parallel
	const [participants, matches, predictions] = await Promise.all([
		fetchSheet<Participant>(SHEETS.PARTICIPANTS),
		fetchSheet<Match>(SHEETS.MATCHES),
		fetchSheet<Prediction>(SHEETS.PREDICTIONS),
	]);

	// build leaderboard from raw data
	const { leaderboard, effectiveDay } = calculateLeaderboard({
		participants,
		matches,
		predictions,
	});

	// count only published matches && score != null
	const matchesCount = matches.filter(
		(m) =>
			m.status === MATCH_STATUS.PUBLISHED &&
			m.home_score != null &&
			m.away_score != null,
	).length;

	return {
		leaderboard,
		day: effectiveDay,
		matchesCount,
	};
}
