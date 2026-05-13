import Link from "next/link";

export default function Header() {
	return (
		<header className="p-4 border-b border-zinc-800 mb-6">
			<div className="flex gap-4">
				<Link href="/" className="font-bold">
					Bolão
				</Link>
				<Link href="/leaderboard">Classificação</Link>
				<Link href="/predictions">Apostas</Link>
			</div>
		</header>
	);
}
