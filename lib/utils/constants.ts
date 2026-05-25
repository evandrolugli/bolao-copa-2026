import type { Match } from "@/lib/utils/types";

export const POINTS = {
	exactHits: 5,
	correctHits: 2,
	wrong: 0,
} as const;

export const FINAL_STANDINGS_POINTS = {
	champion: 10,
	vice: 5,
	third: 3,
	fourth: 3,
} as const;

export const PREDICTION_STATUS = {
	PENDING: "pending",
	EXACT: "exact",
	CORRECT: "correct",
} as const;

export function isMatchPublished(
	match: Match,
): match is Match & { home_score: number; away_score: number } {
	return (
		match.status === "publicar" &&
		match.home_score != null &&
		match.away_score != null
	);
}
