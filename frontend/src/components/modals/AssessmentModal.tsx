"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

type Course = { id: number; name: string; code: string };
type RowEditable = "name" | "mark" | "weight";
type Row = { id?: number; name: string; mark: string; weight: string };

type Props = {
  course: Course; // passed from courses
  onClose: () => void; // inform parent to clear "active" state
};

export default function AssessmentsModal({ course, onClose }: Props) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    if (!course) return;
    fetch(`http://localhost:8000/courses/${course.id}/assignments`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) =>
        setRows(
          data.map((a: any) => ({
            id: a.id,
            name: a.name,
            mark: String(a.mark),
            weight: String(a.weight),
          }))
        )
      )
      .finally(() => setLoading(false));
  }, [course.id]);

  const addRow = async () => {
    const blank: Row = { name: "", mark: "", weight: "" };
    setRows((r) => [...r, blank]);
  };

  const saveRow = async (idx: number, row: Row) => {
    // simple validation
    if (!row.name || !row.mark || !row.weight) return;

    // post req only if its a new row
    if (!row.id) {
      const res = await fetch(
        `http://localhost:8000/courses/${course.id}/assignments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: row.name,
            mark: parseFloat(row.mark),
            weight: parseFloat(row.weight),
          }),
        }
      );
      const data = await res.json();
      setRows((r) => {
        const copy = [...r];
        copy[idx] = { ...row, id: data.id }; // store returned id
        return copy;
      });
    }
  };

  const deleteRow = async (idx: number) => {
    const row = rows[idx];
    if (row.id) {
      await fetch(
        `http://localhost:8000/courses/${course.id}/assignments/${row.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }
    setRows((r) => r.filter((_, i) => i !== idx));
  };

  const calc = () => {
    let total = 0;
    let sumW = 0;
    rows.forEach((r) => {
      const m = parseFloat(r.mark);
      let w = parseFloat(r.weight);
      if (isNaN(m) || isNaN(w)) return;
      if (w > 1) w /= 100; // accept “25” as 0.25
      total += m * w;
      sumW += w;
    });
    setResult(sumW ? total / sumW : null);
  };

  const update = (idx: number, field: RowEditable, val: string) =>
    setRows((r) => {
      const copy = [...r];
      copy[idx] = { ...copy[idx], [field]: val }; // keep row shape
      return copy;
    });

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {course.name}{" "}
            <span className="text-muted-foreground">[{course.code}]</span>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-center py-6">Loading…</p>
        ) : (
          <>
            <div className="grid grid-cols-[1fr_90px_90px_32px] gap-2 px-1 py-2 text-xs font-medium text-muted-foreground border-b">
              <span>Name</span>
              <span className="text-center">Mark %</span>
              <span className="text-center">Weight</span>
              <span />
            </div>

            <div className="max-h-[55vh] overflow-y-auto space-y-2 py-2 pr-1">
              {rows.map((row, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_90px_90px_32px] gap-2 items-center"
                >
                  <Input
                    value={row.name}
                    placeholder="Assignment"
                    onChange={(e) => update(i, "name", e.target.value)}
                    onBlur={() => saveRow(i, row)}
                  />
                  <Input
                    value={row.mark}
                    placeholder="78"
                    className="text-center"
                    onChange={(e) => update(i, "mark", e.target.value)}
                    onBlur={() => saveRow(i, row)}
                  />
                  <Input
                    value={row.weight}
                    placeholder="0.25"
                    className="text-center"
                    onChange={(e) => update(i, "weight", e.target.value)}
                    onBlur={() => saveRow(i, row)}
                  />
                  <button
                    onClick={() => deleteRow(i)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2">
              <Button variant="outline" onClick={addRow} className="w-full">
                + Add Assessment
              </Button>
              <Button
                onClick={calc}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                Calculate Weighted Grade
              </Button>

              {result !== null && (
                <p className="text-center pt-1">
                  Weighted grade:
                  <span
                    className={`font-semibold ml-1 ${
                      result >= 50 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {result.toFixed(2)}%
                  </span>
                </p>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
