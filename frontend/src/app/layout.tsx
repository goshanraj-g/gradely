import "./globals.css";
import NavBar from "@/components/layout/NavBar";
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col h-screen">
        <NavBar />
        <main className="flex-1 overflow-auto">
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
