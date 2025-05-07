"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
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

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.detail || "Signup failed");
        return;
      }
      window.location.href = "/sign-in";
    } catch (error) {
      console.error("Error connecting to server:", error);
      alert("Error connecting to server");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 space-y-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Start tracking your grades with TermCalc
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {password && confirmPassword && password !== confirmPassword && (
              <p className="text-sm text-red-500">Passwords do not match</p>
            )}
            {email && !isEmailValid && (
              <p className="text-sm text-red-500">Email is not valid</p>
            )}
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={!isEmailValid || password !== confirmPassword}
            >
              Sign Up with Email
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground p-4">Or</p>

          <Button
            variant="outline"
            className="flex items-center justify-center w-full max-w-sm cursor-pointer"
            onClick={() => signIn("google")}
          >
            <GoogleIcon />
            <span>Sign up with Google</span>
          </Button>

          <p className="mt-4 text-sm text-center">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-bold underline hover:no-underline"
            >
              Sign in here
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
