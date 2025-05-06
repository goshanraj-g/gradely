"use client";
import QuickStartModal from "@/components/modals/QuickStartModal";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col h-full">
      {" "}
      {/* full-height inside main */}
      {/* Top spacer */}
      <div className="flex-1" />
      {/* Center content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 max-w-xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">TermCalc</h1>
        <p className="text-muted-foreground mb-6">
          Track your grades, simulate scenarios, and plan your academic success.
        </p>
        <QuickStartModal />
      </div>
      {/* Bottom card */}
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
