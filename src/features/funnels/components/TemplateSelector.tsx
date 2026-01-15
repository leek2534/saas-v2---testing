"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { checkoutTemplates, PageTemplate } from "../templates/checkout-templates";

interface TemplateSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (template: PageTemplate | null) => void;
  stepType: "checkout" | "offer" | "thankyou" | "page";
}

export function TemplateSelector({ open, onClose, onSelect, stepType }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<PageTemplate | null>(null);

  console.log("TemplateSelector render - open:", open, "stepType:", stepType);

  const templates = stepType === "checkout" ? checkoutTemplates : [];
  
  console.log("Available templates:", templates.length);

  const handleSelect = () => {
    onSelect(selectedTemplate);
    onClose();
  };

  const handleSkip = () => {
    onSelect(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto z-[9999]">
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
          <DialogDescription>
            Select a pre-designed template to get started quickly, or skip to start with a blank page.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              className={`border rounded-lg p-4 text-left transition-all hover:shadow-md ${
                selectedTemplate?.id === template.id
                  ? "border-primary ring-2 ring-primary"
                  : "border-gray-200"
              }`}
            >
              <div className="aspect-video bg-gray-100 rounded mb-3 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Preview</span>
              </div>
              <h3 className="font-semibold mb-1">{template.name}</h3>
              <p className="text-sm text-muted-foreground">{template.description}</p>
            </button>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handleSkip}>
            Skip - Start Blank
          </Button>
          <Button onClick={handleSelect} disabled={!selectedTemplate}>
            Use Selected Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
