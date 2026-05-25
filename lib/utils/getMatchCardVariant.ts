import { isMatchPublished } from "./constants";
import type { Match } from "./types";

export function getMatchCardVariant(match: Match) {
	if (isMatchPublished(match)) return "published";
	return "pending";
}
