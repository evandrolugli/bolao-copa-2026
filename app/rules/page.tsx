"use client";

import RulesAccordion from "@/components/RulesAccordion";

export default function RulesPage() {
	return (
		<main className="page-container">
			{/* HEADER */}
			<div className="mb-10">
				<h1 className="text-4xl font-bold tracking-tight">Regulamento</h1>
				<p className="text-zinc-500 mt-2">Bolão da Copa do Mundo 2026</p>
			</div>

			{/* FULL RULES */}
			<RulesAccordion />
		</main>
	);
}
