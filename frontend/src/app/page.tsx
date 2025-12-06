"use client";

import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import AssessmentsModal from "@/components/modals/AssessmentModal";

// Types
export type Assignment = {
  id: string;
  name: string;
  mark: string;
  weight: string;
};

export type Course = {
  id: string;
  name: string;
  code: string;
  assignments: Assignment[];
};

const STORAGE_KEY = "gradely_courses";

function loadCourses(): Course[] {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  return [];
}

function saveCourses(courses: Course[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
}

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);

  const [newName, setNewName] = useState("");
  const [newCode, setNewCode] = useState("");

  useEffect(() => {
    setMounted(true);
    setCourses(loadCourses());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveCourses(courses);
    }
  }, [courses, isLoaded]);

  const handleAddCourse = () => {
    if (!newName.trim() || !newCode.trim()) return;

    const newCourse: Course = {
      id: nanoid(),
      name: newName.trim(),
      code: newCode.trim().toUpperCase(),
      assignments: [],
    };

    setCourses((prev) => [...prev, newCourse]);
    setNewName("");
    setNewCode("");
    setAddModalOpen(false);
  };

  const handleDeleteCourse = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const handleUpdateCourse = (updatedCourse: Course) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c))
    );
  };

  const calculateGrade = (assignments: Assignment[]): number | null => {
    let total = 0;
    let sumWeight = 0;
    assignments.forEach(({ mark, weight }) => {
      const m = parseFloat(mark);
      const w = parseFloat(weight);
      if (!isNaN(m) && !isNaN(w) && w > 0) {
        total += m * w;
        sumWeight += w;
      }
    });
    return sumWeight > 0 ? total / sumWeight : null;
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-dot-pattern">
      <main className="max-w-5xl mx-auto px-6 py-12">

        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 text-black">
            Academic Dashboard
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            Manage your courses, track your performance, and simulate your future grades. Simple, fast, and local.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Add Course Card */}
          <button
            onClick={() => setAddModalOpen(true)}
            className="group flex flex-col items-center justify-center h-[200px] rounded-2xl border-2 border-dashed border-gray-300 hover:border-black hover:bg-gray-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-black group-hover:text-white flex items-center justify-center transition-colors mb-3">
              <Plus size={24} />
            </div>
            <span className="font-medium text-muted-foreground group-hover:text-black">Add New Course</span>
          </button>

          {/* Course Cards */}
          {courses.map((course) => {
            const grade = calculateGrade(course.assignments);
            const hasGrade = grade !== null;

            return (
              <div
                key={course.id}
                onClick={() => setActiveCourse(course)}
                className="group relative flex flex-col justify-between h-[200px] p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden"
              >
                {/* Decorative gradient blob */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -z-0 group-hover:bg-gray-100 transition-colors" />

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-2">
                    <span className="inline-block px-2 py-1 rounded-md bg-black text-white text-xs font-bold tracking-wide">
                      {course.code}
                    </span>
                    <button
                      onClick={(e) => handleDeleteCourse(course.id, e)}
                      className="relative z-20 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all hover:scale-110 active:scale-90"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <h3 className="text-xl font-bold leading-tight pr-4">{course.name}</h3>
                </div>

                <div className="relative z-10 flex items-end justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {course.assignments.length} assessment{course.assignments.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    {hasGrade ? (
                      <span className="text-3xl font-extrabold tracking-tight">
                        {grade.toFixed(1)}<span className="text-lg text-muted-foreground font-medium">%</span>
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground italic">No grades yet</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Add Course Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="sm:max-w-[400px] p-6 rounded-2xl">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold">New Course</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Course Name</label>
              <Input
                placeholder="e.g. Introduction to Psychology"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="h-12 text-lg"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Course Code</label>
              <Input
                placeholder="e.g. PSYCH 101"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                className="h-12 text-lg font-mono uppercase"
              />
            </div>
            <Button
              onClick={handleAddCourse}
              disabled={!newName.trim() || !newCode.trim()}
              className="w-full h-12 text-lg font-medium bg-black hover:bg-gray-800 text-white rounded-xl mt-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Create Course
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assessment Modal */}
      {activeCourse && (
        <AssessmentsModal
          course={activeCourse}
          onClose={() => setActiveCourse(null)}
          onUpdate={handleUpdateCourse}
        />
      )}
    </div>
  );
}
