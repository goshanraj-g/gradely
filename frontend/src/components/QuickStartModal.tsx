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

type Assessment = {
  name: string;
  mark: string;
  weight: string;
};

export default function QuickStartModal() {
  const [assessments, setAssessments] = useState<Assessment[]>([
    // state will be an array of assessment objects
    { name: "", mark: "", weight: "" },
  ]);
  const [result, setResult] = useState<number | null>(null); // initial value of null

  const handleChange = (
    index: number,
    field: keyof Assessment, // which property of assessment
    value: string
  ) => {
    const updated = [...assessments];
    updated[index][field] = value;
    setAssessments(updated);
  };

  const addRow = () => {
    setAssessments([...assessments, { name: "", mark: "", weight: "" }]);
  };

  const removeRow = (index: number) => {
    const updated = assessments.filter((_, i) => i !== index); // return everything except for i not being index
    setAssessments(updated);
  };

  const calculateWeightedGrade = () => {
    let total = 0;
    let weightSum = 0;
    for (const a of assessments) {
      const mark = parseFloat(a.mark);
      const weight = parseFloat(a.weight);
      if (isNaN(mark) || isNaN(weight)) continue;
      total += mark * weight;
      weightSum += weight;
    }
    if (weightSum > 0) {
      setResult(total / weightSum);
    } else {
      setResult(null);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mb-4 cursor-pointer">Quickstart</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quick Grade Calculator</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {assessments.map((a, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 items-center">
              <Input
                placeholder="Name"
                value={a.name}
                onChange={(e) => handleChange(i, "name", e.target.value)}
              />
              <Input
                placeholder="Mark (%)"
                value={a.mark}
                onChange={(e) => handleChange(i, "mark", e.target.value)}
              />
              <Input
                placeholder="Weight (0.10)"
                value={a.weight}
                onChange={(e) => handleChange(i, "weight", e.target.value)}
              />
              <Button
                variant="destructive"
                className="col-span-3"
                onClick={() => removeRow(i)}
              >
                Remove
              </Button>
            </div>
          ))}

          <Button variant="outline" onClick={addRow}>
            + Add Assessment
          </Button>

          <Button onClick={calculateWeightedGrade} className="w-full">
            Calculate Weighted Grade
          </Button>

          {result !== null && (
            <p className="text-sm text-muted-foreground">
              Your current weighted grade is:{" "}
              <span className="font-bold">{result.toFixed(2)}%</span>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
