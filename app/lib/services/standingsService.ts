import { fetchGoogleSheet } from "../googleSheets/fetchSheet";

import { SHEETS } from "../googleSheets/sheetsConfig";

import { calculateStandings } from "../utils/calculateStandings";

import type {
  Participant,
  Match,
  Prediction,
} from "../utils/types";

export async function getStandings() {
  const [participants, matches, predictions] =
    await Promise.all([
      fetchGoogleSheet<Participant>(
        SHEETS.PARTICIPANTS
      ),

      fetchGoogleSheet<Match>(
        SHEETS.MATCHES
      ),

      fetchGoogleSheet<Prediction>(
        SHEETS.PREDICTIONS
      ),
    ]);

  return calculateStandings({
    participants,
    matches,
    predictions,
  });
}