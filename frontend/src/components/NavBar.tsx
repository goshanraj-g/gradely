// components/NavBar.tsx
import { Button } from "@/components/ui/button";

export default function NavBar() {
  return (
    <header className="w-full border-b">
      <nav className="flex items-center justify-between p-4">
        {/* Left side: Logo or title */}
        <div className="text-xl font-bold">GradeTracker</div>

        {/* Center: Nav links */}
        <ul className="hidden md:flex gap-6 text-sm text-muted-foreground"></ul>

        {/* Right side: Button or profile */}
        <Button variant="outline">Sign In</Button>
      </nav>
    </header>
  );
}
