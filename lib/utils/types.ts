// =============================
// PARTICIPANTS
// =============================

export type Participant = {
	id: number;
	name: string;
};

// =============================
// MATCHES
// =============================

export type MatchStatus = "pending" | "publicar";

export type Match = {
	id: number;
	phase: string;
	round: string;
	group: string;
	home: string;
	away: string;
	home_score: number | null;
	away_score: number | null;
	is_brazil: boolean;
	day: number;
	status: MatchStatus;
};

export type MatchStats = {
	exact: number;
	correct: number;
	wrong: number;
};

// =============================
// PREDICTIONS
// =============================

export type Prediction = {
	participant_id: number;
	match_id: number;
	pred_home: number;
	pred_away: number;
};

export type PredictionStatus = "exact" | "correct" | "wrong" | "pending";

export type PredictionWithParticipant = Prediction & {
	participant: Participant;
};

export type ScoredPrediction = PredictionWithParticipant & {
	points: number;
	status: PredictionStatus;
};

// =============================
// FINALISTS
// =============================

export type FinalistsPrediction = {
	participant_id: number;
	champion: string;
	vice: string;
	third: string;
	fourth: string;
	participantName?: string;
};

export type Finalists = Record<
	"champion" | "vice" | "third" | "fourth",
	string
>;

// =============================
// LEADERBOARD / ENRICHED TYPES
// =============================

export type MatchWithPredictions = Match & {
	predictions: ScoredPrediction[];
	stats: MatchStats;

	leaderboard?: {
		id: number;
		position: number;
	}[];
};
