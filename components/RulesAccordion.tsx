"use client";

import { useState } from "react";

export default function RulesAccordion() {
	const [open, setOpen] = useState<number | null>();

	function toggle(section: number) {
		setOpen(open === section ? null : section);
	}

	return (
		<main className="page-container">
			{/* Header */}
			<div className="mb-10">
				<h1 className="page-title">Regulamento</h1>
				<p className="text-zinc-500 mt-2">Bolão da Copa do Mundo 2026</p>
			</div>

			<div className="space-y-5">
				{/* INSCRIÇÕES */}
				<div className="surface overflow-hidden">
					<button
						onClick={() => toggle(1)}
						className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-zinc-50 transition"
					>
						<span className="font-semibold text-lg">Inscrições</span>
						<span className="text-muted text-xl">{open === 1 ? "−" : "+"}</span>
					</button>

					{open === 1 && (
						<div className="px-6 pb-6 text-sm text-foreground/80 space-y-4">
							<div>
								<p className="font-semibold text-zinc-800">Pagamento</p>
								<p>Taxa única de R$ 100 até 07/06/2026</p>
								<p className="text-sky-700 font-medium">
									Pix: Banco Inter | Erick Fujiki | 11942700902
								</p>
							</div>

							<div>
								<p className="font-semibold text-zinc-800">Primeira fase</p>
								<p>Enviar todos os palpites de uma vez até 07/06/2026</p>
								<p>Também enviar campeão, vice, terceiro e quarto colocado</p>
							</div>

							<div>
								<p className="font-semibold text-zinc-800">Fases finais</p>
								<p>
									Os palpites das fases finais serão enviados conforme a
									competição avança
								</p>
								<p className="text-zinc-500">
									(prazos serão informados pela organização)
								</p>
							</div>

							<div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-zinc-600 space-y-1">
								<p>• Se não enviar no prazo, o placar será considerado 0x0</p>
								<p>
									• Resultado válido apenas para 90 minutos (sem prorrogação)
								</p>
							</div>

							<p className="text-xs text-zinc-500">
								Para preencher pelo celular, use o app Excel.
							</p>
						</div>
					)}
				</div>

				{/* PONTUAÇÃO */}
				<div className="surface overflow-hidden">
					<button
						onClick={() => toggle(2)}
						className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-zinc-50 transition"
					>
						<span className="font-semibold text-lg">Pontuação</span>
						<span className="text-muted text-xl">{open === 2 ? "−" : "+"}</span>
					</button>

					{open === 2 && (
						<div className="px-6 pb-6 text-sm text-zinc-700 space-y-6">
							{/* RULES */}
							<div className="space-y-2">
								<p className="font-semibold text-zinc-900">Como funciona</p>
								<p>
									<span className="font-medium">2 pontos</span> → acertar
									vencedor ou empate
								</p>
								<p>
									<span className="font-medium">5 pontos</span> → acertar o
									placar exato
								</p>
								<p>
									<span className="font-medium">bônus</span> → campeão +10, vice
									+5, 3º e 4º +3
								</p>
							</div>

							{/* EXAMPLE 1 */}
							<div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 space-y-2">
								<p className="font-semibold text-zinc-900">
									Resultado: Brasil 3 x 1 Argentina
								</p>

								<p>
									Pim → 3x1 →{" "}
									<span className="font-semibold text-emerald-600">5 pts</span>
								</p>
								<p>
									Julia → 3x0 →{" "}
									<span className="font-semibold text-amber-600">2 pts</span>
								</p>
								<p>
									João → 6x0 →{" "}
									<span className="font-semibold text-amber-600">2 pts</span>
								</p>
								<p>
									Fernanda → 1x1 → <span className="text-zinc-500">0 pts</span>
								</p>
								<p>
									Erick → 0x2 → <span className="text-zinc-500">0 pts</span>
								</p>
							</div>

							{/* EXAMPLE 2 */}
							<div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 space-y-2">
								<p className="font-semibold text-zinc-900">
									Resultado: França 1 x 1 Alemanha
								</p>

								<p>
									Pim → 1x1 →{" "}
									<span className="font-semibold text-emerald-600">5 pts</span>
								</p>
								<p>
									Julia → 0x0 →{" "}
									<span className="font-semibold text-amber-600">2 pts</span>
								</p>
								<p>
									Fernanda → 2x2 →{" "}
									<span className="font-semibold text-amber-600">2 pts</span>
								</p>
								<p>
									João → 1x0 → <span className="text-zinc-500">0 pts</span>
								</p>
								<p>
									Erick → 1x2 → <span className="text-zinc-500">0 pts</span>
								</p>
							</div>
						</div>
					)}
				</div>

				{/* PREMIAÇÃO */}
				<div className="surface overflow-hidden">
					<button
						onClick={() => toggle(3)}
						className="w-full flex items-center justify-between px-6 py-5 text-left surface-hover transition"
					>
						<span className="font-semibold text-lg">Premiação</span>
						<span className="text-muted text-xl">{open === 3 ? "−" : "+"}</span>
					</button>

					{open === 3 && (
						<div className="px-6 pb-6 text-sm text-zinc-700 space-y-6">
							<p className="font-semibold text-zinc-900">
								Distribuição dos prêmios
							</p>

							{/* TABLE */}
							<div className="overflow-hidden border border-zinc-200 rounded-xl">
								<table className="w-full text-sm">
									<thead className="bg-zinc-50 text-left text-zinc-600">
										<tr>
											<th className="p-3 font-medium">Prêmio</th>
											<th className="p-3 font-medium text-center">Valor</th>
											<th className="p-3 font-medium">Descrição</th>
										</tr>
									</thead>

									<tbody className="divide-y divide-zinc-200">
										<tr>
											<td className="p-3 font-medium">🥇 1º lugar</td>
											<td className="p-3 text-center font-bold text-emerald-700">
												R$ 4.440
											</td>
											<td className="p-3">Maior pontuação geral (40%)</td>
										</tr>

										<tr>
											<td className="p-3 font-medium">🥈 2º lugar</td>
											<td className="p-3 text-center font-bold text-zinc-700">
												R$ 1.650
											</td>
											<td className="p-3">
												Segundo maior pontuador geral (15%)
											</td>
										</tr>

										<tr>
											<td className="p-3 font-medium">🥉 3º lugar</td>
											<td className="p-3 text-center font-bold text-zinc-700">
												R$ 880
											</td>
											<td className="p-3">
												Terceiro maior pontuador geral (8%)
											</td>
										</tr>

										<tr>
											<td className="p-3 font-medium">Rodada 1</td>
											<td className="p-3 text-center font-bold text-sky-700">
												R$ 440
											</td>
											<td className="p-3">
												Maior pontuação nos 2 primeiros jogos de cada grupo
											</td>
										</tr>

										<tr>
											<td className="p-3 font-medium">Rodada 2</td>
											<td className="p-3 text-center font-bold text-sky-700">
												R$ 440
											</td>
											<td className="p-3">
												Maior pontuação nos 3º e 4º jogos de cada grupo
											</td>
										</tr>

										<tr>
											<td className="p-3 font-medium">Rodada 3</td>
											<td className="p-3 text-center font-bold text-sky-700">
												R$ 440
											</td>
											<td className="p-3">
												Maior pontuação nos 2 últimos jogos de cada grupo
											</td>
										</tr>

										<tr>
											<td className="p-3 font-medium">Primeira fase</td>
											<td className="p-3 text-center font-bold text-violet-700">
												R$ 550
											</td>
											<td className="p-3">
												Maior pontuação total da fase de grupos
											</td>
										</tr>

										<tr>
											<td className="p-3 font-medium">Segunda fase</td>
											<td className="p-3 text-center font-bold text-violet-700">
												R$ 550
											</td>
											<td className="p-3">
												Maior pontuação da segunda fase (mata-mata)
											</td>
										</tr>

										<tr>
											<td className="p-3 font-medium">Seleção Brasil</td>
											<td className="p-3 text-center font-bold text-amber-600">
												R$ 330
											</td>
											<td className="p-3">
												Maior pontuação nos jogos do Brasil
											</td>
										</tr>

										<tr>
											<td className="p-3 font-medium">Placar em cheio</td>
											<td className="p-3 text-center font-bold text-emerald-700">
												R$ 220
											</td>
											<td className="p-3">Maior número de placares exatos</td>
										</tr>

										<tr>
											<td className="p-3 font-medium">Churrasco</td>
											<td className="p-3 text-center font-bold text-zinc-700">
												R$ 1100
											</td>
											<td className="p-3">
												Contribuição para o evento final entre participantes
											</td>
										</tr>
									</tbody>
								</table>
							</div>

							{/* DESEMPATE */}
							<div className="space-y-2">
								<p className="font-semibold text-zinc-900">Desempate</p>

								<p>
									Em caso de empate em qualquer premiação, os critérios serão
									aplicados na seguinte ordem:
								</p>

								<ol className="list-decimal pl-5 space-y-1 text-zinc-700">
									<li>Maior número de placares exatos (resultado em cheio)</li>
									<li>Maior pontuação nos jogos da seleção do Brasil</li>
									<li>
										Se o empate persistir, o valor do prêmio será dividido
										igualmente entre os participantes
									</li>
								</ol>
							</div>
						</div>
					)}
				</div>
			</div>
		</main>
	);
}
