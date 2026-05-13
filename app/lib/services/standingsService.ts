import { fetchGoogleSheet } from "../googleSheets/fetchSheet";
import { SHEETS } from "../googleSheets/sheetsConfig";
import { calculateStandings } from "../utils/calculateStandings";
import type { Match, Participant, Prediction } from "../utils/types";

export async function getStandings() {
	// Fetch data
	const [participants, matches, predictions] = await Promise.all([
		fetchGoogleSheet<Participant>(SHEETS.PARTICIPANTS),
		fetchGoogleSheet<Match>(SHEETS.MATCHES),
		fetchGoogleSheet<Prediction>(SHEETS.PREDICTIONS),
	]);

	// Only published matches
	const publishedMatches = matches.filter((m) => m.status === "publicar");

	// Latest day from published matches
	const latestDay = publishedMatches.length
		? Math.max(...publishedMatches.map((m) => m.day))
		: 0;

	// Matches used for scoring
	const scoringMatches = publishedMatches;

	// Calculate standings
	const standings = calculateStandings({
		participants,
		matches: scoringMatches,
		predictions,
	});

	// Return result
	return {
		standings,
		day: latestDay,
		matchesCount: scoringMatches.length,
	};
}
