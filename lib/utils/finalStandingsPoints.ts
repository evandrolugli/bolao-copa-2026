import { FINAL_STANDINGS_POINTS } from "@/lib/utils/constants";
import { FinalStandings, FinalStandingsPrediction } from "@/lib/utils/types";

export function calculateFinalStandingsPoints(
	pred: FinalStandingsPrediction,
	result: FinalStandings,
) {
	let points = 0;

	if (pred.champion === result.champion) {
		points += FINAL_STANDINGS_POINTS.champion;
	}

	if (pred.vice === result.vice) {
		points += FINAL_STANDINGS_POINTS.vice;
	}

	if (pred.third === result.third) {
		points += FINAL_STANDINGS_POINTS.third;
	}

	if (pred.fourth === result.fourth) {
		points += FINAL_STANDINGS_POINTS.fourth;
	}

	return points;
}
