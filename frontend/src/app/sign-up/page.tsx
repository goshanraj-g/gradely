"use client";

import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

export default function SignUpPage() {
  const [email, setEmail] = useState(""); // set default to ""
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    // TO DO: SEND EMAIL + PASSWORD TO FASTAPI
    console.log({ email, password });
  };

  const handleGoogleSignIn = () => {
    window.location.href = "temp"; // sets browers url
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
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
              onFocus={() => setIsEmailFocused(true)}
              onBlur={() => setIsEmailFocused(false)}
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
            {password !== "" &&
              confirmPassword !== "" &&
              password !== confirmPassword && (
                <p className="text-sm text-red-500">Passwords do not match</p>
              )}
            {!isEmailFocused && email !== "" && !isEmailValid && (
              <p className="text-sm text-red-500">Email is not valid</p>
            )}
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={password !== confirmPassword || !isEmailValid}
            >
              Sign Up with Email
            </Button>
          </form>

          <div className="my-4 text-center text-sm text-muted-foreground">
            or
          </div>

          <Button
            variant="outline"
            className="w-full cursor-pointer"
            onClick={handleGoogleSignIn}
          >
            Sign In with Google
          </Button>

          <p className="mt-4 text-sm text-center">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-gray-700 hover:underline font-bold"
            >
              Sign in here
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
