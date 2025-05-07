"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import AddCourseModal from "@/components/modals/AddCourseModal";
import AssessmentsModal from "@/components/modals/AssessmentModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

type Course = { id: number; name: string; code: string };

export default function CoursesPage() {
  const { status } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Course | null>(null);
  const [toDelete, setToDelete] = useState<Course | null>(null);

  useEffect(() => {
    const jwt = localStorage.getItem("token");

    if (status === "unauthenticated" && !jwt) {
      router.push("/sign-in");
      return;
    }

    if ((status === "authenticated" || jwt) && jwt) {
      fetchCourses(jwt);
    }
  }, [status]);

  const fetchCourses = async (token: string) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch courses");
      setCourses(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    const token = localStorage.getItem("token") || "";

    const res = await fetch(`http://localhost:8000/courses/${toDelete.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      console.error("Delete failed:", await res.text());
      alert("Error deleting course.");
      return;
    }

    setToDelete(null);
    fetchCourses(token);
  };

  if (status === "loading" || loading) {
    return (
      <main className="p-6 min-h-screen flex items-center justify-center">
        Loading…
      </main>
    );
  }

  return (
    <main className="p-6 min-h-screen bg-gray-50">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Your Courses</h1>
        <AddCourseModal
          onCourseAdded={() =>
            fetchCourses(localStorage.getItem("token") || "")
          }
        />
      </div>

      {courses.length === 0 ? (
        <p className="text-muted-foreground text-center">
          No courses yet. Add one above.
        </p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {courses.map((c) => (
            <Card
              key={c.id}
              onClick={() => setActive(c)}
              className="relative group cursor-pointer"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setToDelete(c);
                }}
                className="absolute top-2 right-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition text-muted-foreground hover:text-destructive"
                aria-label="Delete course"
              >
                <Trash2 size={16} />
              </button>

              <CardHeader>
                <CardTitle>{c.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Course Code: {c.code}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {active && (
        <AssessmentsModal course={active} onClose={() => setActive(null)} />
      )}

      <Dialog open={!!toDelete} onOpenChange={() => setToDelete(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete this course?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-4">
            This will remove{" "}
            <span className="font-medium">{toDelete?.name}</span> and all its
            assessments. This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
