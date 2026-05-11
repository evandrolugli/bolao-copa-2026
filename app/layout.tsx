import "./globals.css";
import Header from "./components/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-white">
        <Header />
        <main className="max-w-5xl mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
}