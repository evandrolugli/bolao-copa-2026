import { getStandings } from "../../lib/services/standingsService";

export async function GET() {
  try {
    const standings = await getStandings();

    return Response.json({ standings });
  } catch (error) {
    console.error("Standings API Error:", error);

    return Response.json(
      { error: "Failed to load standings" },
      { status: 500 }
    );
  }
}