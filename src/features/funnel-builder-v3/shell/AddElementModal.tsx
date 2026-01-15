"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  LayoutTemplate,
  Rows3,
  Columns3,
  Type,
  Square,
  Image as ImageIcon,
  Minus,
  Plus,
  Gift,
  ArrowRight,
  Check,
} from "lucide-react";
import { useFunnelEditorStore } from "../store/store";
import { cn } from "@/lib/utils";

type Step = "section" | "row" | "column" | "element" | "complete";

interface AddElementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddElementModal({ open, onOpenChange }: AddElementModalProps) {
  const [step, setStep] = React.useState<Step>("section");
  const [sectionAdded, setSectionAdded] = React.useState(false);
  const [rowAdded, setRowAdded] = React.useState(false);
  const [columnAdded, setColumnAdded] = React.useState(false);

  const addSection = useFunnelEditorStore((s) => s.addSection);
  const addSectionToActivePopup = useFunnelEditorStore((s) => s.addSectionToActivePopup);
  const addRow = useFunnelEditorStore((s) => s.addRow);
  const addColumn = useFunnelEditorStore((s) => s.addColumn);
  const addElement = useFunnelEditorStore((s) => s.addElement);
  const workspace = useFunnelEditorStore((s) => s.workspace);
  const selectedId = useFunnelEditorStore((s) => s.selectedId);
  const tree = useFunnelEditorStore((s) => s.tree);

  const selectedNode = selectedId ? tree.nodes[selectedId] : undefined;

  const handleAddSection = () => {
    if (workspace === "popup") {
      addSectionToActivePopup();
    } else {
      addSection();
    }
    setSectionAdded(true);
    setStep("row");
  };

  const handleAddRow = () => {
    addRow();
    setRowAdded(true);
    setStep("column");
  };

  const handleAddColumn = () => {
    addColumn();
    setColumnAdded(true);
    setStep("element");
  };

  const handleAddElement = (kind: string) => {
    addElement(kind as any);
    setStep("complete");
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after close animation
    setTimeout(() => {
      setStep("section");
      setSectionAdded(false);
      setRowAdded(false);
      setColumnAdded(false);
    }, 200);
  };

  const handleStartOver = () => {
    setStep("section");
    setSectionAdded(false);
    setRowAdded(false);
    setColumnAdded(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {step === "section" && "Step 1: Add a Section"}
            {step === "row" && "Step 2: Add a Row"}
            {step === "column" && "Step 3: Add a Column"}
            {step === "element" && "Step 4: Add an Element"}
            {step === "complete" && "Complete!"}
          </DialogTitle>
          <DialogDescription>
            {step === "section" && "Sections are the main building blocks of your page. They contain rows."}
            {step === "row" && "Rows organize content horizontally. They contain columns."}
            {step === "column" && "Columns divide rows into vertical sections. They contain elements."}
            {step === "element" && "Elements are the content blocks like text, buttons, and images."}
            {step === "complete" && "You've successfully added your first content block!"}
          </DialogDescription>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 py-4">
          {["section", "row", "column", "element"].map((s, i) => (
            <React.Fragment key={s}>
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors",
                  step === s
                    ? "bg-slate-900 text-white"
                    : (s === "section" && sectionAdded) ||
                      (s === "row" && rowAdded) ||
                      (s === "column" && columnAdded) ||
                      step === "complete"
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-100 text-slate-500"
                )}
              >
                {(s === "section" && sectionAdded) ||
                (s === "row" && rowAdded) ||
                (s === "column" && columnAdded) ||
                step === "complete" ? (
                  <Check size={14} />
                ) : (
                  i + 1
                )}
              </div>
              {i < 3 && (
                <div
                  className={cn(
                    "h-0.5 w-8 transition-colors",
                    (s === "section" && sectionAdded) ||
                      (s === "row" && rowAdded) ||
                      (s === "column" && columnAdded)
                      ? "bg-emerald-500"
                      : "bg-slate-200"
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="space-y-4">
          {step === "section" && (
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
                    <LayoutTemplate size={20} />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">Section</div>
                    <div className="text-sm text-slate-500">Full-width container for your content</div>
                  </div>
                </div>
                <Button onClick={handleAddSection} className="w-full gap-2">
                  <Plus size={16} />
                  Add Section
                </Button>
              </div>
            </div>
          )}

          {step === "row" && (
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
                    <Rows3 size={20} />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">Row</div>
                    <div className="text-sm text-slate-500">Horizontal container for columns</div>
                  </div>
                </div>
                <Button
                  onClick={handleAddRow}
                  className="w-full gap-2"
                  disabled={selectedNode?.type !== "section"}
                >
                  <Plus size={16} />
                  Add Row to Section
                </Button>
                {selectedNode?.type !== "section" && (
                  <p className="mt-2 text-xs text-amber-600">
                    Please select the section you just created on the canvas first.
                  </p>
                )}
              </div>
            </div>
          )}

          {step === "column" && (
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
                    <Columns3 size={20} />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">Column</div>
                    <div className="text-sm text-slate-500">Vertical container for elements</div>
                  </div>
                </div>
                <Button
                  onClick={handleAddColumn}
                  className="w-full gap-2"
                  disabled={selectedNode?.type !== "row"}
                >
                  <Plus size={16} />
                  Add Column to Row
                </Button>
                {selectedNode?.type !== "row" && (
                  <p className="mt-2 text-xs text-amber-600">
                    Please select the row you just created on the canvas first.
                  </p>
                )}
              </div>
            </div>
          )}

          {step === "element" && (
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 text-sm font-medium text-slate-700">Choose an element to add:</div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { kind: "heading", icon: Type, label: "Heading" },
                    { kind: "paragraph", icon: Type, label: "Text" },
                    { kind: "button", icon: Square, label: "Button" },
                    { kind: "image", icon: ImageIcon, label: "Image" },
                    { kind: "divider", icon: Minus, label: "Divider" },
                    { kind: "spacer", icon: Plus, label: "Spacer" },
                    { kind: "checkout", icon: ArrowRight, label: "Checkout" },
                    { kind: "offer", icon: Gift, label: "Offer" },
                  ].map((el) => (
                    <Button
                      key={el.kind}
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddElement(el.kind)}
                      disabled={selectedNode?.type !== "column"}
                      className="flex-col gap-1 py-3"
                    >
                      <el.icon size={16} />
                      <span className="text-xs">{el.label}</span>
                    </Button>
                  ))}
                </div>
                {selectedNode?.type !== "column" && (
                  <p className="mt-2 text-xs text-amber-600">
                    Please select the column you just created on the canvas first.
                  </p>
                )}
              </div>
            </div>
          )}

          {step === "complete" && (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <Check size={32} className="text-emerald-600" />
              </div>
              <div>
                <div className="font-medium text-slate-900">Great job!</div>
                <div className="text-sm text-slate-500">
                  You've learned the basics of building with sections, rows, columns, and elements.
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleStartOver} className="flex-1">
                  Add More
                </Button>
                <Button onClick={handleClose} className="flex-1">
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>

        {step !== "complete" && (
          <div className="flex justify-between border-t border-slate-100 pt-4">
            <Button variant="ghost" size="sm" onClick={handleClose}>
              Skip Tutorial
            </Button>
            {step !== "section" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (step === "row") setStep("section");
                  if (step === "column") setStep("row");
                  if (step === "element") setStep("column");
                }}
              >
                Back
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
