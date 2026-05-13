export function rankLeaderboard(leaderboard) {
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

		const isTie =
			prev &&
			prev.points === current.points &&
			prev.exactHits === current.exactHits &&
			prev.brazilPoints === current.brazilPoints;

		current.position = isTie ? prev.position : position;

		position++;
	}
}
