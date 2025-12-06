export const metadata = {
  title: "Gradely",
  icons: {
    icon: "/favicon.png",
  },
};
import "./globals.css";
import NavBar from "@/components/layout/NavBar";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col h-screen">
        <NavBar />
        <main className="flex-1 overflow-auto">
          {children}
          <Toaster />
        </main>
      </body>
    </html>
  );
}
