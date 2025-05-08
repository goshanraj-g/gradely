"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

/* ------------------------------------------------------------------ */
/*  type helpers                                                      */
/* ------------------------------------------------------------------ */
type Course = { id: number; name: string; code: string };
type RowEditable = "name" | "mark" | "weight";
type Row = { id?: number; name: string; mark: string; weight: string };

type Props = {
  course: Course;
  onClose: () => void;
};

/* ------------------------------------------------------------------ */
/*  component                                                         */
/* ------------------------------------------------------------------ */
export default function AssessmentsModal({ course, onClose }: Props) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  // weighted-grade
  const [result, setResult] = useState<number | null>(null);

  // scenario calculator
  const [scenarioAssignmentId, setScenarioAssignmentId] = useState<number | "">(
    ""
  );
  const [scenarioTarget, setScenarioTarget] = useState("");
  const [scenarioResult, setScenarioResult] = useState<number | null>(null);

  /* ------------------------- fetch assignments -------------------- */
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

  /* -------------------------- helpers ----------------------------- */
  const update = (idx: number, field: RowEditable, val: string) =>
    setRows((r) => {
      const copy = [...r];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });

  const addRow = () =>
    setRows((r) => [...r, { name: "", mark: "", weight: "" }]);

  const saveRow = async (idx: number, row: Row) => {
    if (!row.name || !row.mark || !row.weight || row.id) return;

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
      copy[idx] = { ...row, id: data.id };
      return copy;
    });
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
      const w = parseFloat(r.weight);
      if (!isNaN(m) && !isNaN(w)) {
        total += m * w;
        sumW += w;
      }
    });
    setResult(sumW ? total / sumW : null);
  };

  const calculateScenario = async () => {
    if (!scenarioAssignmentId || !scenarioTarget) return;
    const t = parseFloat(scenarioTarget);
    if (isNaN(t)) return alert("Enter a valid target %");

    const res = await fetch(
      `http://localhost:8000/courses/${course.id}/assignments/${scenarioAssignmentId}/scenario?target=${t}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) {
      const err = await res.text();
      return alert("Error: " + err);
    }
    const data = await res.json();
    setScenarioResult(data.needed_mark);
  };

  /* ------------------------------------------------------------------ */
  /*  render                                                            */
  /* ------------------------------------------------------------------ */
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
            {/* table header */}
            <div className="grid grid-cols-[1fr_90px_90px_32px] gap-2 px-1 py-2 text-xs font-medium text-muted-foreground border-b">
              <span>Name</span>
              <span className="text-center">Mark %</span>
              <span className="text-center">Weight</span>
              <span />
            </div>

            {/* rows */}
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

            {/* actions */}
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

              {/* ---------------------------------------------------------- */}
              {/*  scenario calculator                                       */}
              {/* ---------------------------------------------------------- */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">What do I need?</CardTitle>
                </CardHeader>

                <CardContent className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_auto] gap-4 items-end">
                    {/* assignment selector */}
                    <div className="grid gap-2">
                      <Label htmlFor="assignment">Assignment</Label>
                      <Select
                        value={scenarioAssignmentId?.toString() ?? ""}
                        onValueChange={(val) =>
                          setScenarioAssignmentId(
                            val === "" ? "" : parseInt(val)
                          )
                        }
                      >
                        <SelectTrigger id="assignment">
                          <SelectValue placeholder="Select assignment…" />
                        </SelectTrigger>
                        <SelectContent>
                          {rows
                            .filter((r) => r.id)
                            .map((r) => (
                              <SelectItem key={r.id} value={r.id!.toString()}>
                                {r.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* target input */}
                    <div className="grid gap-2">
                      <Label htmlFor="target">Target %</Label>
                      <Input
                        id="target"
                        type="number"
                        min={0}
                        max={100}
                        step={0.1}
                        placeholder="e.g. 90"
                        value={scenarioTarget}
                        onChange={(e) => setScenarioTarget(e.target.value)}
                      />
                    </div>

                    {/* action button */}
                    <Button
                      className="w-full md:w-auto md:mt-6"
                      onClick={calculateScenario}
                    >
                      Calculate
                    </Button>
                  </div>

                  {scenarioResult !== null && (
                    <p className="text-center text-sm md:text-base">
                      To finish the course at{" "}
                      <span className="font-semibold">{scenarioTarget}%</span>,
                      you need{" "}
                      <span className="font-semibold">
                        {scenarioResult.toFixed(2)}%
                      </span>{" "}
                      on{" "}
                      <span className="font-semibold">
                        {rows.find((r) => r.id === scenarioAssignmentId)?.name}
                      </span>
                      .
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
