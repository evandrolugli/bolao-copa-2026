import { getLeaderboard } from "../../lib/services/leaderboardService";

export async function GET() {
	try {
		const leaderboard = await getLeaderboard();

		return Response.json({ leaderboard });
	} catch (error) {
		console.error("Leaderboard API Error:", error);

		return Response.json(
			{ error: "Failed to load leaderboard" },
			{ status: 500 },
		);
	}
}
