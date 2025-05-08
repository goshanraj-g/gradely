export const metadata = {
  title: "Gradely",
  icons: {
    icon: "/favicon.png",
  },
};


import "./globals.css";
import NavBar from "@/components/layout/NavBar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col h-screen">
        <NavBar />
        <main className="flex-1 overflow-auto">{children}</main>
      </body>
    </html>
  );
}
