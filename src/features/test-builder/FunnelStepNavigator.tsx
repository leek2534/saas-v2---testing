"use client";



import React, { useState, useRef } from 'react';
import { useTestBuilderV2Store, StepType } from './store';
import { 
  Home, Mail, DollarSign, TrendingUp, TrendingDown, CheckCircle, 
  Video, ShoppingCart, Plus, MoreVertical, Edit2, Copy, Trash2, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Maximize2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Step type icons and colors
const STEP_TYPE_CONFIG: Record<StepType, { icon: typeof Home; color: string; bgColor: string }> = {
  landing: { icon: Home, color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
  optin: { icon: Mail, color: 'text-green-600', bgColor: 'bg-green-50 dark:bg-green-900/20' },
  sales: { icon: DollarSign, color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
  upsell: { icon: TrendingUp, color: 'text-orange-600', bgColor: 'bg-orange-50 dark:bg-orange-900/20' },
  downsell: { icon: TrendingDown, color: 'text-yellow-600', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20' },
  thankyou: { icon: CheckCircle, color: 'text-emerald-600', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20' },
  webinar: { icon: Video, color: 'text-red-600', bgColor: 'bg-red-50 dark:bg-red-900/20' },
  checkout: { icon: ShoppingCart, color: 'text-indigo-600', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20' },
};

export function FunnelStepNavigator() {
  const { funnel, currentStepId, switchToStep, addStep, deleteStep, duplicateStep, renameStep, getCurrentStep } = useTestBuilderV2Store();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [selectedStepType, setSelectedStepType] = useState<StepType>('landing');
  const [newStepName, setNewStepName] = useState('');
  const [renamingStepId, setRenamingStepId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredStepId, setHoveredStepId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleAddStep = () => {
    addStep(selectedStepType, newStepName || undefined);
    setShowAddDialog(false);
    setNewStepName('');
    setSelectedStepType('landing');
  };

  const handleRenameStep = () => {
    if (renamingStepId && newStepName.trim()) {
      renameStep(renamingStepId, newStepName.trim());
      setShowRenameDialog(false);
      setRenamingStepId(null);
      setNewStepName('');
    }
  };

  const handleDeleteStep = (stepId: string) => {
    if (confirm('Are you sure you want to delete this step?')) {
      deleteStep(stepId);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const currentStep = getCurrentStep();
  const previewStep = hoveredStepId ? funnel.steps.find(s => s.id === hoveredStepId) : currentStep;

  return (
    <>
      {/* Expandable Preview Panel */}
      <div 
        className={cn(
          "bg-card border-t border-border overflow-hidden transition-all duration-300",
          isExpanded ? "h-[300px]" : "h-0"
        )}
      >
        {isExpanded && previewStep && (
          <div className="h-full p-4 overflow-auto">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">{previewStep.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {previewStep.sections.length} section{previewStep.sections.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <ChevronDown size={20} />
              </button>
            </div>
            
            {/* Mini Preview */}
            <div className="border border-border rounded-lg overflow-hidden bg-muted">
              {previewStep.sections.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Maximize2 size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Empty Page</p>
                  </div>
                </div>
              ) : (
                <div 
                  className="origin-top-left bg-card overflow-hidden"
                  style={{
                    transform: 'scale(0.15)',
                    transformOrigin: 'top left',
                    width: '667%',
                    height: '667%',
                  }}
                >
                  {previewStep.sections.map((section) => (
                    <div key={section.id} className="border-b border-border p-4">
                      <div className="text-xs text-muted-foreground mb-2">Section: {section.name}</div>
                      {section.rows.map((row) => (
                        <div key={row.id} className="mb-2 flex gap-2">
                          {row.columns.map((col) => (
                            <div 
                              key={col.id} 
                              className="border border-border rounded p-2 bg-muted"
                              style={{ width: `${col.width}%` }}
                            >
                              <div className="text-xs text-muted-foreground">{col.elements.length} element{col.elements.length !== 1 ? 's' : ''}</div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigator Bar */}
      <div className="h-[70px] bg-card border-t border-border flex items-center px-3 gap-2 shadow-lg relative">
        {/* Scroll Left Button */}
        <button
          onClick={() => scroll('left')}
          className="flex-shrink-0 w-8 h-8 rounded-full bg-muted hover:bg-accent flex items-center justify-center transition-colors"
          title="Scroll left"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Steps Container */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {funnel.steps
            .sort((a, b) => a.order - b.order)
            .map((step, index) => {
              const config = STEP_TYPE_CONFIG[step.type];
              const Icon = config.icon;
              const isActive = step.id === currentStepId;

              return (
                <div
                  key={step.id}
                  onClick={() => {
                    switchToStep(step.id);
                    setIsExpanded(false); // Collapse when clicking a step
                  }}
                  onMouseEnter={() => setHoveredStepId(step.id)}
                  onMouseLeave={() => setHoveredStepId(null)}
                  className={cn(
                    'flex-shrink-0 w-[160px] h-[54px] rounded-lg border-2 transition-all cursor-pointer group relative',
                    isActive
                      ? 'border-primary bg-primary/10 shadow-md'
                      : 'border-border bg-card hover:border-primary/50'
                  )}
                >
                  {/* Step Content */}
                  <div className="p-2 flex items-center gap-2 h-full">
                    {/* Step Number Badge */}
                    <div className={cn(
                      'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                      isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    )}>
                      {index + 1}
                    </div>

                    {/* Step Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-0.5">
                        <Icon size={12} className={config.color} />
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                          {step.type}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-foreground truncate">
                        {step.name}
                      </p>
                    </div>

                    {/* Quick Actions Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className={cn(
                            'flex-shrink-0 w-6 h-6 rounded flex items-center justify-center transition-colors',
                            'opacity-0 group-hover:opacity-100',
                            'hover:bg-accent'
                          )}
                        >
                          <MoreVertical size={14} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setRenamingStepId(step.id);
                            setNewStepName(step.name);
                            setShowRenameDialog(true);
                          }}
                        >
                          <Edit2 size={14} className="mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateStep(step.id);
                          }}
                        >
                          <Copy size={14} className="mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteStep(step.id);
                          }}
                          className="text-red-600 dark:text-red-400"
                        >
                          <Trash2 size={14} className="mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
              );
            })}
        </div>

        {/* Scroll Right Button */}
        <button
          onClick={() => scroll('right')}
          className="flex-shrink-0 w-8 h-8 rounded-full bg-muted hover:bg-accent flex items-center justify-center transition-colors"
          title="Scroll right"
        >
          <ChevronRight size={16} />
        </button>

        {/* Expand/Collapse Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-shrink-0 w-10 h-10 rounded-full bg-muted hover:bg-accent flex items-center justify-center transition-colors"
          title={isExpanded ? "Collapse preview" : "Expand preview"}
        >
          {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>

        {/* Add Step Button */}
        <button
          onClick={() => setShowAddDialog(true)}
          className="flex-shrink-0 w-10 h-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center transition-colors shadow-lg"
          title="Add new step"
        >
          <Plus size={20} strokeWidth={2.5} />
        </button>
      </div>

      {/* Add Step Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Step</DialogTitle>
            <DialogDescription>
              Choose a step type and optionally customize the name
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Step Type</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {(Object.keys(STEP_TYPE_CONFIG) as StepType[]).map((type) => {
                  const config = STEP_TYPE_CONFIG[type];
                  const Icon = config.icon;
                  return (
                    <button
                      key={type}
                      onClick={() => setSelectedStepType(type)}
                      className={cn(
                        'p-3 rounded-lg border-2 transition-all text-left',
                        selectedStepType === type
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary'
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon size={16} className={config.color} />
                        <span className="text-sm font-medium capitalize">{type}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <Label htmlFor="step-name">Step Name (Optional)</Label>
              <Input
                id="step-name"
                value={newStepName}
                onChange={(e) => setNewStepName(e.target.value)}
                placeholder={`${selectedStepType.charAt(0).toUpperCase() + selectedStepType.slice(1)} Page`}
                className="mt-2"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddStep}>
              Add Step
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Step Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Step</DialogTitle>
            <DialogDescription>
              Enter a new name for this step
            </DialogDescription>
          </DialogHeader>

          <div>
            <Label htmlFor="rename-step">Step Name</Label>
            <Input
              id="rename-step"
              value={newStepName}
              onChange={(e) => setNewStepName(e.target.value)}
              placeholder="Enter step name"
              className="mt-2"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleRenameStep();
                }
              }}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenameDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenameStep}>
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
