"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  onCourseAdded?: () => void;
};

export default function AddCourseModal({ onCourseAdded }: Props) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [open, setOpen] = useState(false);

  //   const handleAddCourse = async () => {
  //     const token = localStorage.getItem("token");
  //     if (!token) return;

  //     try {
  //       const res = await fetch("http://localhost:8000/courses", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({ name, code }),
  //       });

  //       if (!res.ok) throw new Error("Failed to add course");

  //       setOpen(false);
  //       setName("");
  //       setCode("");

  //       if (onCourseAdded) onCourseAdded();
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ New Course</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Course Name (e.g. Linear Algebra)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Course Code (e.g. MATH 1B03)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button
            className="w-full"
            // onClick={handleAddCourse}
            disabled={!name || !code}
          >
            Add Course
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
