import { fetchSheet } from "@/lib/googleSheets/fetchSheet";
import { SHEETS } from "@/lib/googleSheets/sheetsConfig";
import type { FinalistsPrediction, Participant } from "../utils/types";

export async function getFinalistsPredictions(): Promise<
	FinalistsPrediction[]
> {
	const data = await fetchSheet<FinalistsPrediction>(
		SHEETS.FINALISTS_PREDICTIONS,
	);

	return data;
}

export async function getFinalistsPredictionsWithNames() {
	const [finalists, participants] = await Promise.all([
		fetchSheet<FinalistsPrediction>(SHEETS.FINALISTS_PREDICTIONS),
		fetchSheet<Participant>(SHEETS.PARTICIPANTS),
	]);

	const participantMap = new Map<number, Participant>(
		participants.map((p) => [p.id, p]),
	);

	return finalists.map((f) => ({
		...f,
		participantName: participantMap.get(f.participant_id)?.name ?? "Unknown",
	}));
}
