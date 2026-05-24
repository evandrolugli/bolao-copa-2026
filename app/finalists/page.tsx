import { getFinalistsPredictionsWithNames } from "../lib/services/finalistsService";

export const dynamic = "force-dynamic";

export default async function FinalistsPage() {
	const finalists = await getFinalistsPredictionsWithNames();

	return (
		<main className="min-h-screen bg-zinc-100 text-zinc-900 p-6">
			<div className="max-w-5xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-4xl font-bold tracking-tight text-zinc-900">
						Finalistas
					</h1>
				</div>

				{/* Table */}
				<div className="overflow-x-auto rounded-3xl border border-zinc-200 bg-white shadow-lg">
					<table className="w-full text-sm md:text-base border-collapse">
						{/* Header */}
						<thead>
							<tr className="bg-gradient-to-r from-zinc-900 to-zinc-800 text-white">
								<th className="p-4 text-left font-semibold">Participante</th>

								<th className="p-4 text-center font-semibold">Campeão</th>

								<th className="p-4 text-center font-semibold">Vice</th>

								<th className="p-4 text-center font-semibold">Terceiro</th>

								<th className="p-4 text-center font-semibold">Quarto</th>
							</tr>
						</thead>

						{/* Body */}
						<tbody className="text-zinc-900">
							{finalists.map((f) => {
								return (
									<tr
										key={f.participant_id}
										className="border-t border-zinc-200 bg-white hover:bg-zinc-50 transition-colors duration-200"
									>
										{/* Participant */}
										<td className="p-4 font-semibold whitespace-nowrap">
											{f.participantName}
										</td>

										{/* Champion */}
										<td className="p-4 text-center">
											<div className="inline-flex items-center justify-center min-w-[90px] h-9 px-3 rounded-lg text-zinc-700">
												{f.champion}
											</div>
										</td>

										{/* Vice */}
										<td className="p-4 text-center">
											<div className="inline-flex items-center justify-center min-w-[90px] h-9 px-3 rounded-lg text-zinc-700">
												{f.vice}
											</div>
										</td>

										{/* Third */}
										<td className="p-4 text-center">
											<div className="inline-flex items-center justify-center min-w-[90px] h-9 px-3 rounded-lg text-zinc-700">
												{f.third}
											</div>
										</td>

										{/* Fourth */}
										<td className="p-4 text-center">
											<div className="inline-flex items-center justify-center min-w-[90px] h-9 px-3 rounded-lg text-zinc-700">
												{f.fourth}
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</main>
	);
}
