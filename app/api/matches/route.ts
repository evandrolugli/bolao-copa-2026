//import { getMatches } from "@/lib/services/matchService";

export async function GET() {
	return Response.json({
		message: "Matches API working",
	});

	// try {
	// 	const matches = await getMatches();

	// 	return Response.json({ matches });
	// } catch (error) {
	// 	console.error("Matches API Error:", error);

	// 	return Response.json(
	// 		{ error: "Failed to load matches" },
	// 		{ status: 500 }
	// 	);
	// }
}
