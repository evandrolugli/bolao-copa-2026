import { fetchSheet } from "../googleSheets/fetchSheet";
import { SHEETS } from "../googleSheets/sheetsConfig";
import { calculateLeaderboard } from "../utils/calculateLeaderboard";
import { isMatchPublished } from "../utils/constants";
import type { Finalists, Match, Participant, Prediction } from "../utils/types";

export async function getLeaderboard() {
	// fetch all required data in parallel
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
		fetchSheet(SHEETS.FINALISTS_PREDICTIONS),
		fetchSheet(SHEETS.FINALISTS),
	]);

	const finalistsResult: Finalists = {
		champion: "",
		vice: "",
		third: "",
		fourth: "",
	};

	finalistsRows.forEach((row: any) => {
		const keyRaw = String(row.col_0 ?? "")
			.trim()
			.toLowerCase();
		const valueRaw = String(row.col_1 ?? "").trim();

		if (!keyRaw || !valueRaw) return;

		if (keyRaw in finalistsResult) {
			finalistsResult[keyRaw as keyof Finalists] = valueRaw;
		}
	});

	// build leaderboard from raw data
	const { leaderboard, effectiveDay } = calculateLeaderboard({
		participants,
		matches,
		predictions,
		finalistsPredictions,
		finalistsResult,
	});

	// count only published matches (status = "publicar" && score != null)
	const matchesCount = matches.filter(isMatchPublished).length;

	return {
		leaderboard,
		day: effectiveDay,
		matchesCount,
	};
}
