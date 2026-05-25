import { isMatchPublished } from "@/lib/utils/constants";
import type { Match } from "@/lib/utils/types";

export function getMatchCardVariant(match: Match) {
	if (isMatchPublished(match)) return "published";
	return "pending";
}
