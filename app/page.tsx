import RulesAccordion from "@/components/RulesAccordion";

// export default function Home() {
// 	return (
// 		<div className="text-center py-10 px-4 space-y-10">
// 			{/* HEADER */}
// 			<div>
// 				<h1 className="text-3xl font-bold mb-2">Bolão da Copa do Mundo 2026</h1>
// 				<p className="text-zinc-400">
// 					Classificação, palpites e resultados dos participantes
// 				</p>
// 			</div>

// 			{/* RULES */}
// 			<div className="max-w-5xl mx-auto text-left">
// 				<RulesAccordion />
// 			</div>
// 		</div>
// 	);
// }

export default function Home() {
	return (
		<main className="page-container space-y-10">
			{/* HEADER */}
			<div className="text-center space-y-2">
				<h1 className="text-3xl font-bold">Bolão da Copa do Mundo 2026</h1>
				<p className="text-zinc-500">
					Classificação, palpites e resultados dos participantes
				</p>
			</div>

			{/* RULES */}
			<div>
				<RulesAccordion />
			</div>
		</main>
	);
}
