export function rankLeaderboard(leaderboard: any[]) {
	// sort participants by ranking rules (points → exact hits → brazil points → name)
	leaderboard.sort((a, b) => {
		if (b.points !== a.points) return b.points - a.points;
		if (b.exactHits !== a.exactHits) return b.exactHits - a.exactHits;
		if (b.brazilPoints !== a.brazilPoints)
			return b.brazilPoints - a.brazilPoints;
		return a.name.localeCompare(b.name);
	});

	let position = 1;

	for (let i = 0; i < leaderboard.length; i++) {
		const current = leaderboard[i];
		const prev = leaderboard[i - 1];

		// check if current participant is tied with previous one
		const isTie =
			prev &&
			prev.points === current.points &&
			prev.exactHits === current.exactHits &&
			prev.brazilPoints === current.brazilPoints;

		// keep same position for ties, otherwise assign next rank
		current.position = isTie ? prev.position : position;
		position++;
	}
}
