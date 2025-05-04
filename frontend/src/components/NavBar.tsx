// components/NavBar.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NavBar() {
  return (
    <header className="w-full border-b fixed top-0 bg-white z-50">
      <nav className="flex items-center justify-between p-4">
        <div className="text-xl font-bold">TermCalc</div>

        <ul className="hidden md:flex gap-6 text-sm text-muted-foreground"></ul>

        <Link href="/sign-in">
          <Button variant="outline">Sign In</Button>
        </Link>
      </nav>
    </header>
  );
}
