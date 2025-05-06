"use client"; // all components run on browser

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function SignInPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Access your TermCalc dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              required
            />
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              required
            />
            <Button type="submit" className="w-full">
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
