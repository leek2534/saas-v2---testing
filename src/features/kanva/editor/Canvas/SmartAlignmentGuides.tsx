'use client';

import React from 'react';
import type { AlignmentGuide } from '../../lib/editor/snapEngine';

interface SmartAlignmentGuidesProps {
  guides: AlignmentGuide[];
  canvasWidth: number;
  canvasHeight: number;
}

/**
 * SmartAlignmentGuides - Visual feedback for snapping
 * Shows temporary alignment lines when elements snap together
 */
export function SmartAlignmentGuides({ guides, canvasWidth, canvasHeight }: SmartAlignmentGuidesProps) {
  if (guides.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1500 }}>
      {guides.map((guide, index) => {
        if (guide.type === 'vertical') {
          return (
            <div
              key={`v-${index}`}
              className="absolute animate-fadeIn"
              style={{
                left: guide.position,
                top: Math.max(0, guide.start),
                width: '1px',
                height: Math.min(canvasHeight, guide.end) - Math.max(0, guide.start),
                backgroundColor: '#FF006E',
                boxShadow: '0 0 4px rgba(255, 0, 110, 0.5)',
              }}
            >
              {/* Label */}
              {guide.label && (
                <div
                  className="absolute text-xs font-medium px-2 py-1 rounded whitespace-nowrap"
                  style={{
                    left: '6px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: '#FF006E',
                    color: '#fff',
                    fontSize: '10px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  {guide.label}
                </div>
              )}
            </div>
          );
        } else {
          return (
            <div
              key={`h-${index}`}
              className="absolute animate-fadeIn"
              style={{
                top: guide.position,
                left: Math.max(0, guide.start),
                height: '1px',
                width: Math.min(canvasWidth, guide.end) - Math.max(0, guide.start),
                backgroundColor: '#FF006E',
                boxShadow: '0 0 4px rgba(255, 0, 110, 0.5)',
              }}
            >
              {/* Label */}
              {guide.label && (
                <div
                  className="absolute text-xs font-medium px-2 py-1 rounded whitespace-nowrap"
                  style={{
                    top: '6px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#FF006E',
                    color: '#fff',
                    fontSize: '10px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  {guide.label}
                </div>
              )}
            </div>
          );
        }
      })}
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fadeIn {
            animation: fadeIn 0.15s ease-out;
          }
        `
      }} />
    </div>
  );
}
