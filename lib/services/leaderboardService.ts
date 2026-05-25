import { fetchSheet } from "../googleSheets/fetchSheet";
import { SHEETS } from "../googleSheets/sheetsConfig";
import { calculateLeaderboard } from "../utils/calculateLeaderboard";
import { isMatchPublished } from "../utils/constants";
import type {
	Finalists,
	FinalistsPrediction,
	Match,
	Participant,
	Prediction,
} from "../utils/types";

type FinalistsRow = {
	col_0?: string;
	col_1?: string;
};

function parseFinalists(rows: FinalistsRow[]): Finalists {
	const result: Finalists = {
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
			result[key as keyof Finalists] = value;
		}
	}

	return result;
}

export async function getLeaderboard() {
	const [
		participants,
		matches,
		predictions,
		finalistsPredictions,
		finalistsRows,
	] = await Promise.all([
		fetchSheet<Participant>(SHEETS.PARTICIPANTS),
		fetchSheet<Match>(SHEETS.MATCHES),
		fetchSheet<Prediction>(SHEETS.PREDICTIONS),
		fetchSheet<FinalistsPrediction>(SHEETS.FINALISTS_PREDICTIONS),
		fetchSheet<FinalistsRow>(SHEETS.FINALISTS),
	]);

	const finalistsResult = parseFinalists(finalistsRows);

	const { leaderboard, effectiveDay } = calculateLeaderboard({
		participants,
		matches,
		predictions,
		finalistsPredictions,
		finalistsResult,
	});

	const matchesCount = matches.filter(isMatchPublished).length;

	return {
		leaderboard,
		day: effectiveDay,
		matchesCount,
	};
}
