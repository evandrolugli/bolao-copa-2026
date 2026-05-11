type Standing = {
  id: number;
  nome: string;
  position: number | null;
  points: number;
  exactHits: number;
  correctWinner: number;
  wrong: number;
  brazilPoints: number;
  todayPoints: number;
  positionChange: number;
  totalPredictions: number;
};

async function getStandings(): Promise<Standing[]> {
  const response = await fetch(
    "http://localhost:3000/api/standings",
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch standings");
  }

  const data = await response.json();

  return data.standings;
}

export default async function StandingsPage() {
  const standings = await getStandings();

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Standings
          </h1>

          <p className="text-zinc-400 mt-2">
            Leaderboard based on match predictions
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-zinc-800">
          <table className="w-full text-sm">
            <thead className="bg-zinc-900">
              <tr className="text-left">
                <th className="p-4">#</th>
                <th className="p-4">Participante</th>
                <th className="p-4">Pontos</th>
                <th className="p-4">Resultados em cheio</th>
                <th className="p-4">Desfecho</th>
                <th className="p-4">Errou</th>
                <th className="p-4">Brasil</th>
                <th className="p-4">Pontos do dia</th>
                <th className="p-4">Posição</th>
              </tr>
            </thead>

            <tbody>
              {standings.map((participant) => (
                <tr
                  key={participant.id}
                  className="border-t border-zinc-800 hover:bg-zinc-900 transition"
                >
                  <td className="p-4 font-bold">
                    {participant.position ?? ""}
                  </td>
                  <td className="p-4">
                    {participant.nome}
                  </td>

                  <td className="p-4 font-bold text-green-400">
                    {participant.points}
                  </td>

                  <td className="p-4">
                    {participant.exactHits}
                  </td>

                  <td className="p-4">
                    {participant.correctWinner}
                  </td>

                  <td className="p-4">
                    {participant.wrong}
                  </td>
                  <td className="p-4">
                    {participant.brazilPoints}
                  </td>
                  <td className="p-4">
                    {participant.todayPoints > 0
                      ? `+${participant.todayPoints}`
                      : participant.todayPoints}
                  </td>

                  <td className="p-4">
                    {participant.positionChange > 0
                      ? `+${participant.positionChange}`
                      : participant.positionChange}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}