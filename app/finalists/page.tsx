import { getFinalistsPredictionsWithNames } from "../lib/services/finalistsService";

export const dynamic = "force-dynamic";

export default async function FinalistsPage() {
	const finalists = await getFinalistsPredictionsWithNames();
	console.log("Finalists Predictions:", finalists);

	return (
		<main className="min-h-screen bg-zinc-100 p-6">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-6">Finalistas</h1>

				<div className="overflow-x-auto bg-white border rounded-2xl shadow">
					<table className="w-full text-sm">
						<thead className="bg-zinc-900 text-white">
							<tr>
								<th className="p-3 text-left">Participante</th>
								<th className="p-3">Campeão</th>
								<th className="p-3">Vice</th>
								<th className="p-3">Terceiro</th>
								<th className="p-3">Quarto</th>
							</tr>
						</thead>

						<tbody>
							{finalists.map((f) => (
								<tr key={f.participant_id} className="border-t">
									<td className="p-3 font-semibold">
										{f.participantName} {/* 👈 HERE */}
									</td>

									<td className="p-3 text-center">{f.champion}</td>
									<td className="p-3 text-center">{f.vice}</td>
									<td className="p-3 text-center">{f.third}</td>
									<td className="p-3 text-center">{f.fourth}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</main>
	);
}
