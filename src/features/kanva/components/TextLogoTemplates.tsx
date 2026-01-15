'use client';

import React, { useState } from 'react';
import { useEditorStore } from '../lib/editor/store';
import { TEXT_LOGO_TEMPLATES, textLogoTemplateToElements, getTextLogosByCategory, searchTextLogos, type TextLogoTemplate } from '../lib/text-templates/textLogoLibrary';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { cn } from '../lib/utils';

interface TextLogoTemplatesProps {
  onAdd?: () => void;
}

const CATEGORIES: Array<{ id: TextLogoTemplate['category'] | 'all'; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'bold', label: 'Bold' },
  { id: 'modern', label: 'Modern' },
  { id: 'elegant', label: 'Elegant' },
  { id: 'playful', label: 'Playful' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'decorative', label: 'Decorative' },
];

export function TextLogoTemplates({ onAdd }: TextLogoTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState<TextLogoTemplate['category'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const canvas = useEditorStore((s) => s.canvas);
  const addElement = useEditorStore((s) => s.addElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const getStateSnapshot = useEditorStore((s) => s.getStateSnapshot);

  // Filter templates
  let filteredTemplates = TEXT_LOGO_TEMPLATES;
  if (selectedCategory !== 'all') {
    filteredTemplates = getTextLogosByCategory(selectedCategory);
  }
  if (searchQuery.trim()) {
    filteredTemplates = searchTextLogos(searchQuery);
  }

  const handleAddTemplate = (template: TextLogoTemplate) => {
    // Center the template on the canvas
    const centerX = canvas.width / 2 - template.width / 2;
    const centerY = canvas.height / 2 - template.height / 2;
    
    // Convert template to elements
    const elements = textLogoTemplateToElements(template, centerX, centerY);
    
    // Add all elements to canvas
    elements.forEach(element => {
      addElement(element);
    });
    
    // Push history
    pushHistory(getStateSnapshot());
    
    // Callback
    onAdd?.();
  };

  return (
    <div className="w-80 bg-gray-900 flex flex-col h-full overflow-hidden flex-shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <h3 className="text-white font-semibold mb-4">Text Logos</h3>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            type="text"
            placeholder="Search text logos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                'px-3 py-1 text-xs rounded-full transition-colors',
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {filteredTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleAddTemplate(template)}
              className="group relative bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition-colors border border-gray-700 hover:border-blue-500"
            >
              {/* Preview */}
              <div
                className="relative bg-white rounded mb-2 overflow-hidden"
                style={{
                  width: '100%',
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                }}
              >
                {/* Render template preview */}
                <div className="relative" style={{ width: template.width, height: template.height, transform: 'scale(0.5)', transformOrigin: 'top left' }}>
                  {template.parts.map((part, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: 'absolute',
                        left: part.x,
                        top: part.y,
                        fontSize: part.fontSize,
                        fontFamily: part.fontFamily,
                        fontWeight: part.fontWeight,
                        fontStyle: part.fontStyle,
                        color: part.color,
                        letterSpacing: part.letterSpacing,
                        textTransform: part.textTransform,
                        textDecoration: part.textDecoration,
                        opacity: part.opacity,
                        transform: part.rotation ? `rotate(${part.rotation}deg)` : undefined,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {part.text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Name */}
              <p className="text-white text-xs font-medium truncate">{template.name}</p>
              <p className="text-gray-400 text-xs truncate">{template.description}</p>
            </button>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <p>No text logos found</p>
            <p className="text-sm mt-2">Try a different search or category</p>
          </div>
        )}
      </div>
    </div>
  );
}



