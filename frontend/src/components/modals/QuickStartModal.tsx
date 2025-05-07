"use client";

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
import { useState } from "react";

type Assessment = { name: string; mark: string; weight: string };

export default function QuickStartModal() {
  const [rows, setRows] = useState<Assessment[]>([
    { name: "", mark: "", weight: "" },
  ]);
  const [result, setResult] = useState<number | null>(null);

  const update = (i: number, field: keyof Assessment, val: string) =>
    setRows((r) => {
      const c = [...r];
      c[i][field] = val;
      return c;
    });

  const addRow = () =>
    setRows((r) => [...r, { name: "", mark: "", weight: "" }]);

  const removeRow = (i: number) =>
    setRows((r) => r.filter((_, idx) => idx !== i));

  const calc = () => {
    let total = 0,
      sum = 0;
    rows.forEach(({ mark, weight }) => {
      const m = parseFloat(mark);
      let w = parseFloat(weight);
      if (isNaN(m) || isNaN(w)) return;
      if (w > 1) w /= 100; // allow “25” → 0.25
      total += m * w;
      sum += w;
    });
    setResult(sum ? total / sum : null);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer bg-indigo-600">Do a quick calculation</Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Quick grade calculator</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-[1fr_90px_90px_32px] py-2 text-xs font-medium text-muted-foreground border-b">
          <span>Name</span>
          <span className="text-center">Mark %</span>
          <span className="text-center">Weight</span>
          <span />
        </div>

        <div className="max-h-[55vh] overflow-y-auto space-y-2 py-3 pr-1">
          {rows.map((r, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_90px_90px_32px] gap-2 items-center"
            >
              <Input
                value={r.name}
                placeholder="Assignment"
                onChange={(e) => update(i, "name", e.target.value)}
              />
              <Input
                value={r.mark}
                placeholder="78"
                className="text-center"
                onChange={(e) => update(i, "mark", e.target.value)}
              />
              <Input
                value={r.weight}
                placeholder="0.25"
                className="text-center"
                onChange={(e) => update(i, "weight", e.target.value)}
              />
              <button
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
          <Button variant="outline" onClick={addRow} className="w-full">
            + Add assessment
          </Button>
          <Button
            onClick={calc}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            Calculate weighted grade
          </Button>

          {result !== null && (
            <p className="text-center text-sm">
              Weighted grade:&nbsp;
              <span
                className={`font-semibold ${
                  result >= 50 ? "text-green-600" : "text-red-600"
                }`}
              >
                {result.toFixed(2)}%
              </span>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
