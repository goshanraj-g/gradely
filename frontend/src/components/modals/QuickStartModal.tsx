"use client";

import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type Assessment = {
  id: string;
  name: string;
  mark: string;
  weight: string;
};

export default function QuickStartModal() {
  const [rows, setRows] = useState<Assessment[]>(() => {
    const saved =
      typeof window !== "undefined" && localStorage.getItem("quickCalcRows");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        /* ignore */
      }
    }
    return [{ id: nanoid(), name: "", mark: "", weight: "" }];
  });
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem("quickCalcRows", JSON.stringify(rows));
  }, [rows]);

  const update = (i: number, field: keyof Assessment, val: string) =>
    setRows((r) => {
      const c = [...r];
      c[i] = { ...c[i], [field]: val };
      return c;
    });

  const addRow = () =>
    setRows((r) => [...r, { id: nanoid(), name: "", mark: "", weight: "" }]);

  const removeRow = (i: number) =>
    setRows((r) => r.filter((_, idx) => idx !== i));

  const calc = () => {
    let total = 0;
    let sumW = 0;
    rows.forEach(({ mark, weight }) => {
      const m = parseFloat(mark);
      const w = parseFloat(weight);
      if (isNaN(m) || isNaN(w)) return;
      total += m * w;
      sumW += w;
    });
    setResult(sumW ? total / sumW : null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calc();
  };

  const hasInvalid = rows.some(
    ({ name, mark, weight }) =>
      !name.trim() || isNaN(Number(mark)) || isNaN(Number(weight))
  );
  const hasValid = rows.some(
    ({ mark, weight }) => !isNaN(Number(mark)) && !isNaN(Number(weight))
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          Do a quick calculation
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Quick Grade Calculator</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-[1fr_90px_90px_32px] py-2 text-xs font-medium text-muted-foreground border-b">
            <span>Name</span>
            <span className="text-center">Mark %</span>
            <span className="text-center">Weight</span>
            <span />
          </div>

          <div className="max-h-[55vh] overflow-y-auto space-y-2 py-3 pr-1">
            {rows.map((r, i) => (
              <div
                key={r.id}
                className="grid grid-cols-[1fr_90px_90px_32px] gap-2 items-center"
              >
                <Input
                  value={r.name}
                  placeholder="Assignment"
                  onChange={(e) => update(i, "name", e.target.value)}
                  onBlur={() => update(i, "name", r.name.trim())}
                  autoFocus={i === rows.length - 1}
                />
                <Input
                  type="number"
                  value={r.mark}
                  placeholder="e.g. 78"
                  className="text-center"
                  onChange={(e) => update(i, "mark", e.target.value)}
                />
                <Input
                  type="number"
                  value={r.weight}
                  placeholder="e.g. 0.25"
                  className="text-center"
                  onChange={(e) => update(i, "weight", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label="Remove row"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              onClick={addRow}
              className="w-full"
              disabled={hasInvalid}
            >
              + Add assessment
            </Button>

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              disabled={!hasValid}
            >
              Calculate weighted grade
            </Button>
          </div>

          {result !== null && (
            <p className="text-center text-sm">
              Weighted grade:{" "}
              <span
                className={`font-semibold ${
                  result >= 50 ? "text-green-600" : "text-red-600"
                }`}
              >
                {result.toFixed(2)}%
              </span>
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
