export default function PredictionsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Apostas
      </h1>

      <p className="text-zinc-400">
        Apostas dos participantes
      </p>

      <div className="mt-6 space-y-3">
        <div className="p-4 bg-zinc-900 rounded">
          Brazil vs Serbia → 2-0
        </div>

        <div className="p-4 bg-zinc-900 rounded">
          Argentina vs France → 1-1
        </div>
      </div>
    </div>
  );
}