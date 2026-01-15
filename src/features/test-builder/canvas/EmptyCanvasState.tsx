"use client";

import { Plus, Layout } from 'lucide-react';

interface EmptyCanvasStateProps {
  onAddSection: () => void;
}

/**
 * EmptyCanvasState - Beautiful empty state shown when no sections exist
 */
export function EmptyCanvasState({ onAddSection }: EmptyCanvasStateProps) {
  return (
    <div className="w-full min-h-[600px] flex flex-col items-center justify-center p-8 bg-gradient-to-b from-white to-slate-50 relative">
      {/* Decorative Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-200 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        {/* Icon */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25">
          <Layout className="w-10 h-10 text-white" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-slate-800 mb-3">
          Start Building Your Page
        </h2>

        {/* Description */}
        <p className="text-slate-500 mb-8 leading-relaxed">
          Add sections, rows, and columns to create your perfect layout.
          Drag and drop elements to bring your vision to life.
        </p>

        {/* CTA Button */}
        <button
          onClick={onAddSection}
          className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 text-sm font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Add Your First Section
        </button>

        {/* Helper Text */}
        <p className="mt-6 text-xs text-slate-400">
          Or use the sidebar to browse templates and elements
        </p>
      </div>
    </div>
  );
}
