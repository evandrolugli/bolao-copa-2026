import Link from "next/link";

export default function Header() {
	return (
		<header className="p-4 border-b border-zinc-800 mb-6">
			<div className="flex gap-4">
				<Link href="/">Bolão</Link>
				<Link href="/leaderboard">Classificação</Link>
				<Link href="/predictions">Palpites</Link>
				<Link href="/final-standings">Top 4</Link>
			</div>
		</header>
	);
}
