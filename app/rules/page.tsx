"use client";

import RulesAccordion from "@/components/RulesAccordion";

export default function RulesPage() {
	return (
		<main className="min-h-screen bg-zinc-100 text-zinc-900 p-6">
			<div className="max-w-5xl mx-auto">
				{/* HEADER */}
				<div className="mb-10">
					<h1 className="text-4xl font-bold tracking-tight">Regulamento</h1>
					<p className="text-zinc-500 mt-2">Bolão da Copa do Mundo 2026</p>
				</div>

				{/* FULL RULES */}
				<RulesAccordion />
			</div>
		</main>
	);
}
