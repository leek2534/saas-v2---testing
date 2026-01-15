"use client";



import React, { useState, useMemo } from 'react';
import { ChevronRight, ChevronDown, Eye, EyeOff, Trash2, Edit2, GripVertical, Layers, Box, Columns, Square, Type, Image, Video, MousePointerClick } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useTestBuilderV2Store, type Section, type Row, type Column, type Element, type ElementType } from './store';

interface ElementHierarchyProps {
  className?: string;
}

type HierarchyNode = {
  id: string;
  type: 'section' | 'row' | 'column' | 'element';
  name: string;
  children?: HierarchyNode[];
  sectionId?: string;
  rowId?: string;
  columnId?: string;
  elementType?: ElementType;
};

export function ElementHierarchy({ className }: ElementHierarchyProps) {
  const { 
    sections,
    selectedSectionId,
    selectedRowId,
    selectedColumnId,
    selectedElementId,
    selectSection,
    selectRow,
    selectColumn,
    selectElement,
    renameSection,
    renameRow,
    renameColumn,
    renameElement,
    deleteSection,
    deleteRow,
    deleteColumn,
    deleteElement,
  } = useTestBuilderV2Store();
  
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['all-sections']));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  // Build hierarchy tree from sections
  const hierarchyTree = useMemo((): HierarchyNode[] => {
    return sections.map((section): HierarchyNode => ({
      id: section.id,
      type: 'section',
      name: section.name,
      sectionId: section.id,
      children: section.rows.map((row): HierarchyNode => ({
        id: row.id,
        type: 'row',
        name: row.name,
        sectionId: section.id,
        rowId: row.id,
        children: row.columns.map((column, colIndex): HierarchyNode => ({
          id: column.id,
          type: 'column',
          name: column.name || `Column ${colIndex + 1}`,
          sectionId: section.id,
          rowId: row.id,
          columnId: column.id,
          children: column.elements.map((element): HierarchyNode => ({
            id: element.id,
            type: 'element',
            name: element.name || getElementTypeName(element.type),
            sectionId: section.id,
            rowId: row.id,
            columnId: column.id,
            elementType: element.type,
          })),
        })),
      })),
    }));
  }, [sections]);

  // Get element type display name
  function getElementTypeName(type: ElementType): string {
    const names: Record<ElementType, string> = {
      heading: 'Heading',
      subheading: 'Subheading',
      text: 'Text',
      button: 'Button',
      image: 'Image',
      video: 'Video',
      gif: 'GIF',
      form: 'Form',
      countdown: 'Countdown',
      testimonial: 'Testimonial',
      pricing: 'Pricing',
      socialproof: 'Social Proof',
      progress: 'Progress',
      list: 'List',
      faq: 'FAQ',
      spacer: 'Spacer',
      divider: 'Divider',
      icon: 'Icon',
    };
    return names[type] || type;
  }

  // Get icon for node type
  function getNodeIcon(node: HierarchyNode) {
    const iconClass = "w-4 h-4 flex-shrink-0";
    
    switch (node.type) {
      case 'section':
        return <Box className={iconClass} />;
      case 'row':
        return <Columns className={iconClass} />;
      case 'column':
        return <Square className={iconClass} />;
      case 'element':
        // Element-specific icons
        switch (node.elementType) {
          case 'heading':
          case 'subheading':
          case 'text':
            return <Type className={iconClass} />;
          case 'button':
            return <MousePointerClick className={iconClass} />;
          case 'image':
          case 'gif':
            return <Image className={iconClass} />;
          case 'video':
            return <Video className={iconClass} />;
          default:
            return <Layers className={iconClass} />;
        }
      default:
        return <Layers className={iconClass} />;
    }
  }

  // Toggle node expansion
  function toggleExpand(nodeId: string) {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }

  // Handle node selection
  function handleSelect(node: HierarchyNode) {
    switch (node.type) {
      case 'section':
        selectSection(node.id);
        selectRow(null);
        selectColumn(null);
        selectElement(null);
        break;
      case 'row':
        selectSection(node.sectionId!);
        selectRow(node.id);
        selectColumn(null);
        selectElement(null);
        break;
      case 'column':
        selectSection(node.sectionId!);
        selectRow(node.rowId!);
        selectColumn(node.id);
        selectElement(null);
        break;
      case 'element':
        selectSection(node.sectionId!);
        selectRow(node.rowId!);
        selectColumn(node.columnId!);
        selectElement(node.id);
        break;
    }
  }

  // Check if node is selected
  function isSelected(node: HierarchyNode): boolean {
    switch (node.type) {
      case 'section':
        return selectedSectionId === node.id;
      case 'row':
        return selectedRowId === node.id;
      case 'column':
        return selectedColumnId === node.id;
      case 'element':
        return selectedElementId === node.id;
      default:
        return false;
    }
  }

  // Start editing name
  function startEditing(node: HierarchyNode, e: React.MouseEvent) {
    e.stopPropagation();
    setEditingId(node.id);
    setEditValue(node.name);
  }

  // Save name
  function saveName() {
    if (!editingId || !editValue.trim()) {
      setEditingId(null);
      return;
    }

    const node = findNode(hierarchyTree, editingId);
    if (!node) return;

    switch (node.type) {
      case 'section':
        renameSection(node.id, editValue.trim());
        break;
      case 'row':
        renameRow(node.sectionId!, node.id, editValue.trim());
        break;
      case 'column':
        renameColumn(node.sectionId!, node.rowId!, node.id, editValue.trim());
        break;
      case 'element':
        renameElement(node.id, editValue.trim());
        break;
    }

    setEditingId(null);
    setEditValue('');
  }

  // Find node in tree
  function findNode(nodes: HierarchyNode[], id: string): HierarchyNode | null {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNode(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  // Handle delete
  function handleDelete(node: HierarchyNode, e: React.MouseEvent) {
    e.stopPropagation();
    
    const confirmMessage = `Delete ${node.name}?${node.children && node.children.length > 0 ? ' This will also delete all nested content.' : ''}`;
    if (!confirm(confirmMessage)) return;

    switch (node.type) {
      case 'section':
        deleteSection(node.id);
        break;
      case 'row':
        deleteRow(node.sectionId!, node.id);
        break;
      case 'column':
        deleteColumn(node.sectionId!, node.rowId!, node.id);
        break;
      case 'element':
        deleteElement(node.id);
        break;
    }
  }

  // Render node recursively
  function renderNode(node: HierarchyNode, depth: number = 0): React.ReactNode {
    const isExpanded = expandedNodes.has(node.id);
    const selected = isSelected(node);
    const hasChildren = node.children && node.children.length > 0;
    const isEditing = editingId === node.id;

    return (
      <div key={node.id}>
        {/* Node Row */}
        <div
          className={cn(
            "group flex items-center gap-1.5 px-2 py-1.5 rounded cursor-pointer transition-colors",
            selected && "bg-blue-100 dark:bg-blue-900/30 border-l-2 border-blue-500",
            !selected && "hover:bg-gray-100 dark:hover:bg-gray-800"
          )}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => handleSelect(node)}
        >
          {/* Drag Handle */}
          <GripVertical className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />

          {/* Expand/Collapse */}
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(node.id);
              }}
              className="flex-shrink-0 p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          ) : (
            <div className="w-4" />
          )}

          {/* Icon */}
          {getNodeIcon(node)}

          {/* Name */}
          {isEditing ? (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={saveName}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveName();
                if (e.key === 'Escape') {
                  setEditingId(null);
                  setEditValue('');
                }
              }}
              onClick={(e) => e.stopPropagation()}
              className="h-6 text-xs flex-1"
              autoFocus
            />
          ) : (
            <span className="text-sm flex-1 truncate">
              {node.name}
            </span>
          )}

          {/* Actions */}
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Edit Name */}
            <button
              onClick={(e) => startEditing(node, e)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              title="Rename"
            >
              <Edit2 className="w-3 h-3" />
            </button>

            {/* Delete */}
            <button
              onClick={(e) => handleDelete(node, e)}
              className="p-1 hover:bg-red-200 dark:hover:bg-red-900 rounded text-red-600"
              title="Delete"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4" />
          <h3 className="font-semibold text-sm">Layers</h3>
        </div>
        <div className="text-xs text-gray-500">
          {sections.length} {sections.length === 1 ? 'section' : 'sections'}
        </div>
      </div>

      {/* Hierarchy Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        {hierarchyTree.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <Layers className="w-12 h-12 text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">No sections yet</p>
            <p className="text-xs text-gray-400 mt-1">Add a section to get started</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {hierarchyTree.map((node) => renderNode(node, 0))}
          </div>
        )}
      </div>

      {/* Footer Tips */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <div className="flex items-center gap-2">
            <Edit2 className="w-3 h-3" />
            <span>Click to rename any element</span>
          </div>
          <div className="flex items-center gap-2">
            <Trash2 className="w-3 h-3" />
            <span>Delete removes nested content</span>
          </div>
        </div>
      </div>
    </div>
  );
}
