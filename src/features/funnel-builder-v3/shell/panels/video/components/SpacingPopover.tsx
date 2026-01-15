"use client";

import React from "react";

interface SpacingValue {
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
}

interface SpacingPopoverProps {
  value: SpacingValue;
  onChange: (value: SpacingValue) => void;
}

export function SpacingPopover({ value, onChange }: SpacingPopoverProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const updateValue = (key: keyof SpacingValue, newValue: number) => {
    onChange({ ...value, [key]: newValue });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg hover:bg-slate-50"
      >
        Spacing
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg border border-slate-200 shadow-lg z-20 p-4 space-y-4">
            {/* Margin */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-700">Margin</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-600">Top</label>
                  <input
                    type="number"
                    value={value.marginTop}
                    onChange={(e) => updateValue('marginTop', Number(e.target.value))}
                    className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600">Bottom</label>
                  <input
                    type="number"
                    value={value.marginBottom}
                    onChange={(e) => updateValue('marginBottom', Number(e.target.value))}
                    className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600">Left</label>
                  <input
                    type="number"
                    value={value.marginLeft}
                    onChange={(e) => updateValue('marginLeft', Number(e.target.value))}
                    className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600">Right</label>
                  <input
                    type="number"
                    value={value.marginRight}
                    onChange={(e) => updateValue('marginRight', Number(e.target.value))}
                    className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
                  />
                </div>
              </div>
            </div>

            {/* Padding */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-700">Padding</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-600">Top</label>
                  <input
                    type="number"
                    value={value.paddingTop}
                    onChange={(e) => updateValue('paddingTop', Number(e.target.value))}
                    className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600">Bottom</label>
                  <input
                    type="number"
                    value={value.paddingBottom}
                    onChange={(e) => updateValue('paddingBottom', Number(e.target.value))}
                    className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600">Left</label>
                  <input
                    type="number"
                    value={value.paddingLeft}
                    onChange={(e) => updateValue('paddingLeft', Number(e.target.value))}
                    className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600">Right</label>
                  <input
                    type="number"
                    value={value.paddingRight}
                    onChange={(e) => updateValue('paddingRight', Number(e.target.value))}
                    className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
