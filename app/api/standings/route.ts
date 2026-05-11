import { fetchGoogleSheet } from "../../lib/googleSheets";
import { calculateStandings } from "../../lib/calculateStandings";

export async function GET() {
  try {
    const [participants, matches, predictions] = await Promise.all([
      fetchGoogleSheet("Participants"),
      fetchGoogleSheet("Matches"),
      fetchGoogleSheet("Predictions"),
    ]);

    const standings = calculateStandings({ participants, matches, predictions });

    return Response.json({ standings });
  } catch (error) {
    console.error("Leaderboard API Error:", error);

    return Response.json(
      { error: "Failed to load leaderboard" },
      { status: 500 }
    );
  }
}
