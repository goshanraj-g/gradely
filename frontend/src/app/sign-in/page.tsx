"use client"; // all components run on browser

import Link from "next/link";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const GoogleIcon = () => (
  <svg
    className="w-5 h-5 mr-2"
    viewBox="0 0 533.5 544.3"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M533.5 278.4c0-17.4-1.6-34.2-4.6-50.4H272v95.5h146.9c-6.4 34.7-25.6 64.1-54.8 83.8v69.7h88.5c51.7-47.6 81.9-117.8 81.9-198.6z"
      fill="#4285F4"
    />
    <path
      d="M272 544.3c73.6 0 135.4-24.4 180.5-66.3l-88.5-69.7c-24.6 16.5-56.2 26-92 26-70.7 0-130.5-47.7-152-111.7H31.1v70.4C76 477 168.8 544.3 272 544.3z"
      fill="#34A853"
    />
    <path
      d="M120 324.6c-11.4-34.2-11.4-71.5 0-105.7V148.5H31.1c-39.6 77.5-39.6 168.2 0 245.7L120 324.6z"
      fill="#FBBC05"
    />
    <path
      d="M272 107.7c39.9 0 75.8 13.8 104.1 40.9l78-78C407.4 24.2 345.6 0 272 0 168.8 0 76 67.3 31.1 148.5l88.9 70.4C141.5 155.4 201.3 107.7 272 107.7z"
      fill="#EA4335"
    />
  </svg>
);

export default function SignInPage() {
  const { data: session } = useSession();
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
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.detail || "Login failed");
        return;
      }
      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      window.location.href = "/courses";
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Error logging in");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 -mt-10 space-y-6">
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
          <p className="text-center text-sm text-muted-foreground p-4">
            Or
          </p>

          {session ? (
            <div className="text-center space-y-2">
              <p>Welcome, {session.user?.name}</p>
              <Button onClick={() => signOut()}>Sign Out</Button>
            </div>
          ) : (
            <Button
              variant="outline"
              className="flex items-center justify-center w-full max-w-sm cursor-pointer"
              onClick={() => signIn("google")}
            >
              <GoogleIcon />
              <span>Sign in with Google</span>
            </Button>
          )}

          <p className="mt-4 text-sm text-center">
            Don't have an account?{" "}
            <Link
              href="/sign-up"
              className="font-bold underline hover:no-underline"
            >
              Sign up here
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
