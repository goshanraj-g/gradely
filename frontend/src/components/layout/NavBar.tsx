"use client";

import Link from "next/link";
import Image from "next/image";

export default function NavBar() {
  return (
    <header className="w-full pt-6 px-6 bg-transparent z-50">
      <nav className="flex items-center justify-between max-w-5xl mx-auto">
        <Link href="/">
          <div className="flex items-center gap-2 group cursor-pointer">
            <Image
              src="/favicon.png"
              alt="Gradely Logo"
              width={32}
              height={32}
              className="group-hover:rotate-3 transition-transform"
            />
            <span className="text-xl font-bold font-heading tracking-tight">Gradely</span>
          </div>
        </Link>
      </nav>
    </header>
  );
}
