"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import AddCourseModal from "@/components/modals/AddCourseModal";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Course = {
  id: string;
  name: string;
  code: string;
};

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  <AddCourseModal
  //onCourseAdded={fetchCourses}
  />;

  //   useEffect(() => {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       router.push("/sign-in");
  //     }
  //   }, []);

  //   const fetchCourses = async (token: string) => {
  //     try {
  //       const res = await fetch("http://localhost:8000/courses", {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       const data = await res.json();
  //       setCourses(data);
  //     } catch (err) {
  //       console.error("Failed to fetch courses", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  return (
    <main className="p-6 min-h-screen bg-gray-50">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Your Courses</h1>
        <Button onClick={() => console.log("TODO: MODAL")}>+ New Course</Button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : courses.length === 0 ? (
        <p className="text-muted-foreground">No courses yet. Add one above!</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle>{course.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Course Code: {course.code}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
