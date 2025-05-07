"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import QuickStartModal from "@/components/modals/QuickStartModal";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(Boolean(localStorage.getItem("token")));
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1" />

      <div className="flex-1 flex flex-col items-center justify-center px-4 max-w-xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">TermCalc</h1>
        <p className="text-muted-foreground mb-6">
          Track your grades, simulate scenarios, and plan your academic success.
        </p>

        {loggedIn ? (
          <Link href="/courses">
            <Button className="mb-4 cursor-pointer">Go to Courses</Button>
          </Link>
        ) : (
          <>
            <div className="flex gap-4 mb-4">
              <Link href="/sign-in">
                <Button variant="outline" className="cursor-pointer">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="cursor-pointer">Sign Up</Button>
              </Link>
            </div>
          </>
        )}

        <QuickStartModal />
      </div>

      <div className="flex-1 flex items-end px-4 max-w-xl mx-auto w-full mb-6 text-center">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>What is TermCalc?</CardTitle>
            <CardDescription>
              A smarter way to stay on top of your courses
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Input assessments, simulate final grades, all in one clean dashboard
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
