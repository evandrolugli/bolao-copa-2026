import { fetchSheet } from "@/lib/googleSheets/fetchSheet";
import { SHEETS } from "@/lib/googleSheets/sheetsConfig";
import { calculateLeaderboard } from "@/lib/utils/calculateLeaderboard";
import { isMatchPublished } from "@/lib/utils/constants";
import type {
	FinalStandings,
	FinalStandingsPrediction,
	Match,
	Participant,
	Prediction,
} from "@/lib/utils/types";

type FinalStandingsRow = {
	col_0?: string;
	col_1?: string;
};

function parseFinalStandings(rows: FinalStandingsRow[]): FinalStandings {
	const result: FinalStandings = {
		champion: "",
		vice: "",
		third: "",
		fourth: "",
	};

	for (const row of rows) {
		const key = String(row.col_0 ?? "")
			.trim()
			.toLowerCase();

		const value = String(row.col_1 ?? "").trim();

		if (!key || !value) continue;

		if (key in result) {
			result[key as keyof FinalStandings] = value;
		}
	}

	return result;
}

export async function getLeaderboard() {
	const [
		participants,
		matches,
		predictions,
		finalStandingsPredictions,
		finalStandingsRows,
	] = await Promise.all([
		fetchSheet<Participant>(SHEETS.PARTICIPANTS),
		fetchSheet<Match>(SHEETS.MATCHES),
		fetchSheet<Prediction>(SHEETS.PREDICTIONS),
		fetchSheet<FinalStandingsPrediction>(SHEETS.FINAL_STANDINGS_PREDICTIONS),
		fetchSheet<FinalStandingsRow>(SHEETS.FINAL_STANDINGS),
	]);

	const finalStandings = parseFinalStandings(finalStandingsRows);

	const { leaderboard, effectiveDay } = calculateLeaderboard({
		participants,
		matches,
		predictions,
		finalStandingsPredictions,
		finalStandings,
	});

	const matchesCount = matches.filter(isMatchPublished).length;

	return {
		leaderboard,
		day: effectiveDay,
		matchesCount,
	};
}
