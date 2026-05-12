import Link from "next/link";

export default function Header() {
  return (
    <header className="p-4 border-b border-zinc-800 mb-6">
      <div className="flex gap-4">
        <Link href="/" className="font-bold">Bolão</Link>
        <Link href="/standings">Classificação</Link>
        <Link href="/predictions">Apostas</Link>
      </div>
    </header>
  );
}