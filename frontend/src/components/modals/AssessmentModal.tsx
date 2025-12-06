"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowRight, Plus, Target } from "lucide-react";
import { useState } from "react";
import { nanoid } from "nanoid";
import type { Course, Assignment } from "@/app/page";

type Props = {
  course: Course;
  onClose: () => void;
  onUpdate: (course: Course) => void;
};

export default function AssessmentsModal({ course, onClose, onUpdate }: Props) {
  const [assignments, setAssignments] = useState<Assignment[]>(course.assignments);

  // Scenario state
  const [scenarioTarget, setScenarioTarget] = useState("");
  const [scenarioAssignmentId, setScenarioAssignmentId] = useState<string>("");
  const [scenarioResult, setScenarioResult] = useState<number | null>(null);

  const updateAssignments = (newAssignments: Assignment[]) => {
    setAssignments(newAssignments);
    onUpdate({ ...course, assignments: newAssignments });
  };

  const update = (idx: number, field: keyof Assignment, val: string) => {
    const copy = [...assignments];
    copy[idx] = { ...copy[idx], [field]: val };
    updateAssignments(copy);
  };

  const addRow = () => {
    updateAssignments([
      ...assignments,
      { id: nanoid(), name: "", mark: "", weight: "" },
    ]);
  };

  const deleteRow = (idx: number) => {
    updateAssignments(assignments.filter((_, i) => i !== idx));
  };

  const calculateGrade = () => {
    let total = 0;
    let sumW = 0;
    assignments.forEach((r) => {
      const m = parseFloat(r.mark);
      const w = parseFloat(r.weight);
      if (!isNaN(m) && !isNaN(w)) {
        total += m * w;
        sumW += w;
      }
    });
    return sumW ? total / sumW : null;
  };

  const currentGrade = calculateGrade();

  const calculateScenario = () => {
    if (!scenarioAssignmentId || !scenarioTarget) return;
    const target = parseFloat(scenarioTarget);
    if (isNaN(target)) return;

    const assignment = assignments.find((a) => a.id === scenarioAssignmentId);
    if (!assignment) return;

    const totalWeight = assignments.reduce((sum, a) => {
      const w = parseFloat(a.weight);
      return sum + (isNaN(w) ? 0 : w);
    }, 0);

    const currentSum = assignments.reduce((sum, a) => {
      if (a.id === scenarioAssignmentId) return sum;
      const m = parseFloat(a.mark);
      const w = parseFloat(a.weight);
      if (isNaN(m) || isNaN(w)) return sum;
      return sum + m * w;
    }, 0);

    const assignmentWeight = parseFloat(assignment.weight);
    if (isNaN(assignmentWeight) || assignmentWeight === 0) return;

    const needed = (target * totalWeight - currentSum) / assignmentWeight;
    setScenarioResult(Math.round(needed * 100) / 100);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] p-0 gap-0 overflow-hidden rounded-3xl bg-white flex flex-col max-h-[90vh]">
        <VisuallyHidden>
          <DialogTitle>{course.name} - Assessments</DialogTitle>
        </VisuallyHidden>

        {/* Header */}
        <div className="p-8 border-b bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold font-heading">{course.name}</h2>
            <p className="text-muted-foreground font-mono text-sm">{course.code}</p>
          </div>
          <div className="text-left sm:text-right w-full sm:w-auto bg-white sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0">
            <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Current Grade</div>
            <div className={`text-3xl md:text-4xl font-extrabold ${currentGrade !== null && currentGrade >= 50 ? 'text-black' : 'text-red-500'}`}>
              {currentGrade !== null ? currentGrade.toFixed(2) : "—"}%
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {/* List Header */}
          <div className="grid grid-cols-[1fr_70px_70px_32px] md:grid-cols-[1fr_100px_100px_40px] gap-3 md:gap-4 mb-3 px-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <div>Assessment</div>
            <div className="text-center">Mark (%)</div>
            <div className="text-center">Weight</div>
            <div></div>
          </div>

          {/* Assignments List */}
          <div className="space-y-2">
            {assignments.map((row, i) => (
              <div key={row.id} className="group flex items-center gap-3 md:gap-4 p-2 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                <div className="flex-1 min-w-0">
                  <input
                    className="w-full bg-transparent font-medium focus:outline-none placeholder:text-gray-300 text-sm md:text-base"
                    placeholder="Assessment Name"
                    value={row.name}
                    onChange={(e) => update(i, "name", e.target.value)}
                  />
                </div>
                <div className="w-[70px] md:w-[100px]">
                  <input
                    className="w-full bg-transparent text-center font-mono focus:outline-none placeholder:text-gray-300 text-sm md:text-base"
                    placeholder="—"
                    type="number"
                    value={row.mark}
                    onChange={(e) => update(i, "mark", e.target.value)}
                  />
                </div>
                <div className="w-[70px] md:w-[100px]">
                  <input
                    className="w-full bg-transparent text-center font-mono focus:outline-none placeholder:text-gray-300 text-sm md:text-base"
                    placeholder="—"
                    type="number"
                    step="0.01"
                    value={row.weight}
                    onChange={(e) => update(i, "weight", e.target.value)}
                  />
                </div>
                <div className="w-[32px] md:w-[40px] flex justify-end">
                  <button
                    onClick={() => deleteRow(i)}
                    className="text-gray-300 hover:text-red-500 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all hover:scale-110 active:scale-90"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={addRow}
              className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-sm font-medium text-gray-400 hover:text-black hover:border-black transition-all flex items-center justify-center gap-2 mt-4 hover:scale-[1.01] active:scale-[0.99]"
            >
              <Plus size={18} /> Add Assessment
            </button>
          </div>
        </div>

        {/* Footer / Scenario Tool */}
        <div className="bg-gray-50 p-8 border-t">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <Target size={18} />
            </div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-gray-900">Scenario Calculator</h3>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1.5 block uppercase tracking-wide">If I want a final grade of:</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="e.g. 90"
                    className="w-full h-12 pl-4 pr-8 rounded-xl border border-gray-200 focus:border-black focus:ring-0 text-lg font-medium bg-white shadow-sm transition-all"
                    value={scenarioTarget}
                    onChange={(e) => setScenarioTarget(e.target.value)}
                  />
                  <span className="absolute right-4 top-3.5 text-gray-400 font-medium">%</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 mb-1.5 block uppercase tracking-wide">By getting a mark on:</label>
                <div className="relative">
                  <select
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-black focus:ring-0 text-base bg-white shadow-sm appearance-none transition-all cursor-pointer"
                    value={scenarioAssignmentId}
                    onChange={(e) => setScenarioAssignmentId(e.target.value)}
                  >
                    <option value="" disabled>Select an assessment...</option>
                    {assignments.filter(a => a.name).map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-4 pointer-events-none text-gray-400">
                    <ArrowRight size={16} className="rotate-90" />
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={calculateScenario}
              className="bg-black hover:bg-gray-800 text-white h-12 px-8 rounded-xl font-medium text-base w-full lg:w-auto shadow-lg shadow-gray-200 transition-all hover:scale-105 active:scale-95"
            >
              Calculate
            </Button>
          </div>

          {scenarioResult !== null && (
            <div className="mt-6 p-4 bg-indigo-50 text-indigo-900 rounded-xl text-base flex items-center gap-3 border border-indigo-100 animate-in slide-in-from-bottom-2">
              <div className="w-8 h-8 bg-indigo-200 rounded-full flex items-center justify-center flex-shrink-0">
                <ArrowRight size={16} className="text-indigo-700" />
              </div>
              <span>
                You need to score <span className="font-bold text-xl mx-1">{scenarioResult.toFixed(2)}%</span> on that assessment.
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
