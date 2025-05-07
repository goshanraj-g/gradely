"use client"; // all components run on browser

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const body = new URLSearchParams();
    body.append("username", email);
    body.append("password", password);

    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.detail || "login failed");
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      console.log("loged in ");

      window.location.href = "/courses";
    } catch (error) {
      alert("error logging in");
      console.error(error);
    }
  };
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 -mt-10">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Access your TermCalc dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <Button type="submit" className="w-full cursor-pointer">
              Continue
            </Button>
          </form>
          <p className="mt-4 text-sm text-center">
            Don't have an account?{" "}
            <Link
              href="/sign-up"
              className="text-gray-700 hover:underline font-bold"
            >
              Sign up here
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
