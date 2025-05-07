"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(Boolean(localStorage.getItem("token")));
  }, []);

  const onAuthPage = pathname === "/sign-in" || pathname === "/sign-up";

  const handleLogOut = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    router.push("/");
  };
  return (
    <header className="w-full border-b sticky top-0 bg-white z-50">
      <nav className="flex items-center justify-between p-4">
        <Link href="/">
          <button className="text-xl font-bold cursor-pointer">TermCalc</button>
        </Link>

        <ul className="hidden md:flex gap-6 text-sm text-muted-foreground"></ul>

        {!onAuthPage &&
          (loggedIn ? (
            <Button
              variant="outline"
              onClick={handleLogOut}
              className="cursor-pointer"
            >
              Logout
            </Button>
          ) : (
            <Link href="/sign-in">
              <Button variant="outline" className="cursor-pointer">
                Sign In
              </Button>
            </Link>
          ))}
      </nav>
    </header>
  );
}
