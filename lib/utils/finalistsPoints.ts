import { FINALISTS_POINTS } from "@/lib/utils/constants";
import { Finalists, FinalistsPrediction } from "@/lib/utils/types";

export function calculateFinalistsPoints(
	pred: FinalistsPrediction,
	result: Finalists,
) {
	let points = 0;

	if (pred.champion === result.champion) {
		points += FINALISTS_POINTS.champion;
	}

	if (pred.vice === result.vice) {
		points += FINALISTS_POINTS.vice;
	}

	if (pred.third === result.third) {
		points += FINALISTS_POINTS.third;
	}

	if (pred.fourth === result.fourth) {
		points += FINALISTS_POINTS.fourth;
	}

	return points;
}
