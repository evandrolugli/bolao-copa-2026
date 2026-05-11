import { fetchGoogleSheet } from "../../lib/googleSheets";
import { calculateStandings } from "../../lib/calculateStandings";

export async function GET() {
  const [participants, matches, predictions] = await Promise.all([
    fetchGoogleSheet("Participants"),
    fetchGoogleSheet("Matches"),
    fetchGoogleSheet("Predictions"),
  ]);

  const bets = calculateStandings({ participants, matches, predictions });

  return Response.json({ bets });
}