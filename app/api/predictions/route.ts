import { fetchGoogleSheet } from "../../lib/googleSheets/sheetsConfig";
import { calculateStandings } from "../../lib/services/standingsService";

export async function getStandings() {
  const [participants, matches, predictions] = await Promise.all([
    fetchGoogleSheet("Participants"),
    fetchGoogleSheet("Matches"),
    fetchGoogleSheet("Predictions"),
  ]);

  const bets = calculateStandings({ participants, matches, predictions });
  return Response.json({ bets });
  // return calculateStandings({ participants, matches, predictions, });
}

  