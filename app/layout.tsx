import "@/app/globals.css";
import Header from "@/components/Header";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className="min-h-screen bg-zinc-100 text-zinc-900 antialiased">
				<div className="flex min-h-screen flex-col">
					<Header />

					<main className="flex-1">{children}</main>
				</div>
			</body>
		</html>
	);
}
