"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = { onCourseAdded: () => void };

export default function AddCourseModal({ onCourseAdded }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setError("");
      setTimeout(() => nameRef.current?.focus(), 50);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!name.trim() || !code.trim()) return;
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token") || "";
    if (!token) {
      setError("You must be logged in.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          code: code.trim().toUpperCase(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail ?? "Failed to create course.");
      }

      setOpen(false);
      setName("");
      setCode("");
      onCourseAdded();
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">+ New Course</Button>
      </DialogTrigger>

      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add a course</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            ref={nameRef}
            placeholder="Course name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKey}
          />
          <Input
            placeholder="Course code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKey}
          />

          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button
            onClick={handleSubmit}
            disabled={loading || !name.trim() || !code.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            {loading ? "Adding…" : "Add course"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
