export const dynamic = "force-dynamic";
//import { getStandings as fetchStandings } from "../lib/services/standingsService";
import { getStandings } from "../lib/services/standingsService";

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

  // Secondary columns
  round1: number;
  round2: number;
  round3: number;
  phase1: number;
  phase2: number;
};

export default async function StandingsPage() {
  const day = 1; // from query param or UI
  const standings = await getStandings(day);

  const maxValues = {
    brazilPoints: 0,
    todayPoints: 0,
    positionChange: 0,

    round1: 0,
    round2: 0,
    round3: 0,

    phase1: 0,
    phase2: 0,
  };

  for (const p of standings) {
    maxValues.brazilPoints = Math.max(maxValues.brazilPoints, p.brazilPoints);
    maxValues.todayPoints = Math.max(maxValues.todayPoints, p.todayPoints);
    maxValues.positionChange = Math.max(
      maxValues.positionChange,
      Math.abs(p.positionChange)
    );

    maxValues.round1 = Math.max(maxValues.round1, p.round1);
    maxValues.round2 = Math.max(maxValues.round2, p.round2);
    maxValues.round3 = Math.max(maxValues.round3, p.round3);

    maxValues.phase1 = Math.max(maxValues.phase1, p.phase1);
    maxValues.phase2 = Math.max(maxValues.phase2, p.phase2);
  }

  function isMax(value: number, max: number) {
    return value === max && max !== 0;
  }

  //console.log("MAX VALUES:", maxValues);
  //console.log("STANDINGS SAMPLE:", standings[0]);

  const highlightClass = "bg-yellow-400 text-black font-bold ring-2 ring-yellow-500";

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Classificação
          </h1>

          <p className="text-zinc-400 mt-2">
            Leaderboard based on match predictions
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-zinc-800">
          <table className="w-full text-sm">
            <thead className="bg-zinc-900">
              <tr className="text-center">
                <th className="p-4">#</th>
                <th className="p-4">Participantes</th>
                <th className="p-4">PTS</th>
                <th className="p-4">Em cheio</th>
                <th className="p-4">Desfechos</th>
                <th className="p-4">Erros</th>
                <th className="p-4">Brasil</th>
                <th className="p-4">Δ Pts</th>
                <th className="p-4">Δ Pos</th>

                <th className="p-4 bg-zinc-800 text-zinc-300">R1</th>
                <th className="p-4 bg-zinc-800 text-zinc-300">R2</th>
                <th className="p-4 bg-zinc-800 text-zinc-300">R3</th>
                <th className="p-4 bg-zinc-800 text-zinc-300">F1</th>
                <th className="p-4 bg-zinc-800 text-zinc-300">F2</th>

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
                  <td className={`p-4 ${isMax(participant.brazilPoints, maxValues.brazilPoints)
                    ? highlightClass
                    : ""
                    }`}>
                    {participant.brazilPoints}
                  </td>
                  <td className={`p-4 ${isMax(participant.todayPoints, maxValues.todayPoints) ? highlightClass : ""}`}>
                    {participant.todayPoints > 0
                      ? `+${participant.todayPoints}`
                      : participant.todayPoints}
                  </td>

                  <td className="p-4">
                    {participant.positionChange > 0
                      ? `+${participant.positionChange}`
                      : participant.positionChange}
                  </td>

                  {/* Secondary Columns */}
                  <td className={`p-4 ${isMax(participant.round1, maxValues.round1) ? highlightClass : ""}`}>
                    {participant.round1}
                  </td>

                  <td className={`p-4 ${isMax(participant.round2, maxValues.round2) ? highlightClass : ""}`}>
                    {participant.round2}
                  </td>

                  <td className={`p-4 ${isMax(participant.round3, maxValues.round3) ? highlightClass : ""}`}>
                    {participant.round3}
                  </td>

                  <td className={`p-4 ${isMax(participant.phase1, maxValues.phase1) ? highlightClass : ""}`}>
                    {participant.phase1}
                  </td>

                  <td className="p-4 bg-zinc-950 text-zinc-300">
                    {participant.phase2}
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