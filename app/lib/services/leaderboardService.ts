import { fetchSheet } from "../googleSheets/fetchSheet";
import { SHEETS } from "../googleSheets/sheetsConfig";
import { calculateLeaderboard } from "../utils/calculateLeaderboard";
import { isMatchPublished } from "../utils/constants";
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

	// count only published matches (status = "publicar" && score != null)
	const matchesCount = matches.filter(isMatchPublished).length;

	return {
		leaderboard,
		day: effectiveDay,
		matchesCount,
	};
}
