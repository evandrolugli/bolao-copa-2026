import { fetchSheet } from "@/lib/googleSheets/fetchSheet";
import { SHEETS } from "@/lib/googleSheets/sheetsConfig";
import type { FinalStandingsPrediction, Participant } from "@/lib/utils/types";

// raw final standings predictions (DB layer)
export async function getFinalStandingsPredictions(): Promise<
	FinalStandingsPrediction[]
> {
	return fetchSheet<FinalStandingsPrediction>(
		SHEETS.FINAL_STANDINGS_PREDICTIONS,
	);
}

// adds participant name for display purposes
export async function getFinalStandingsPredictionsWithNames() {
	const [finalStandings, participants] = await Promise.all([
		getFinalStandingsPredictions(),
		fetchSheet<Participant>(SHEETS.PARTICIPANTS),
	]);

	const participantMap = new Map(participants.map((p) => [p.id, p.name]));

	return finalStandings.map((f) => ({
		...f,
		participantName: participantMap.get(f.participant_id) ?? "Unknown",
	}));
}
