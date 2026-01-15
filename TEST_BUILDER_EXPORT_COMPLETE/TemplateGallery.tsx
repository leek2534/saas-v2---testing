"use client";



import React, { useState, useMemo } from 'react';
import { Search, X, Sparkles, Crown, Filter, Grid3x3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { templateLibrary, getTemplatesByCategory, getFeaturedTemplates, searchTemplates } from '@/src/lib/templates/template-library';
import type { FunnelTemplate, TemplateCategory } from '@/src/lib/templates/template-types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface TemplateGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: FunnelTemplate) => void;
}

const categories: { value: TemplateCategory; label: string }[] = [
  { value: 'all', label: 'All Templates' },
  { value: 'local-business', label: 'Local Business' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'saas', label: 'SaaS' },
  { value: 'coaching', label: 'Coaching' },
  { value: 'agency', label: 'Agency' },
  { value: 'health-wellness', label: 'Health & Wellness' },
  { value: 'real-estate', label: 'Real Estate' },
  { value: 'professional-services', label: 'Professional Services' },
  { value: 'beauty-salon', label: 'Beauty & Salon' },
];

export function TemplateGallery({ isOpen, onClose, onSelectTemplate }: TemplateGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTemplate, setSelectedTemplate] = useState<FunnelTemplate | null>(null);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    let templates = templateLibrary;

    // Apply category filter
    if (selectedCategory !== 'all') {
      templates = getTemplatesByCategory(selectedCategory);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      templates = searchTemplates(searchQuery);
    }

    return templates;
  }, [selectedCategory, searchQuery]);

  const featuredTemplates = getFeaturedTemplates();

  const handleSelectTemplate = (template: FunnelTemplate) => {
    setSelectedTemplate(template);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
      setSelectedTemplate(null);
      onClose();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl h-[90vh] p-0 gap-0">
          <DialogHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-500" />
                  Template Gallery
                </DialogTitle>
                <DialogDescription>
                  Choose from {templateLibrary.length} professionally designed templates
                </DialogDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </DialogHeader>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar - Categories */}
            <div className="w-64 border-r bg-gray-50 dark:bg-gray-900 p-4 overflow-y-auto">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">
                  CATEGORIES
                </h3>
                {categories.map((category) => {
                  const count = category.value === 'all' 
                    ? templateLibrary.length 
                    : getTemplatesByCategory(category.value).length;
                  
                  return (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                        selectedCategory === category.value
                          ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 font-medium"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span>{category.label}</span>
                        <span className="text-xs text-gray-500">{count}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Search & Filters */}
              <div className="p-4 border-b bg-white dark:bg-gray-950">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search templates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid3x3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Templates Grid/List */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Featured Templates */}
                {selectedCategory === 'all' && !searchQuery && featuredTemplates.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Crown className="w-5 h-5 text-yellow-500" />
                      Featured Templates
                    </h2>
                    <div className={cn(
                      "grid gap-6",
                      viewMode === 'grid' ? "grid-cols-3" : "grid-cols-1"
                    )}>
                      {featuredTemplates.map((template) => (
                        <TemplateCard
                          key={template.id}
                          template={template}
                          viewMode={viewMode}
                          onSelect={handleSelectTemplate}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* All Templates */}
                <div>
                  {selectedCategory !== 'all' || searchQuery ? (
                    <h2 className="text-lg font-semibold mb-4">
                      {filteredTemplates.length} {filteredTemplates.length === 1 ? 'Template' : 'Templates'}
                    </h2>
                  ) : null}
                  
                  {filteredTemplates.length === 0 ? (
                    <div className="text-center py-12">
                      <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No templates found</p>
                      <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
                    </div>
                  ) : (
                    <div className={cn(
                      "grid gap-6",
                      viewMode === 'grid' ? "grid-cols-3" : "grid-cols-1"
                    )}>
                      {filteredTemplates
                        .filter(t => selectedCategory === 'all' || !t.featured)
                        .map((template) => (
                          <TemplateCard
                            key={template.id}
                            template={template}
                            viewMode={viewMode}
                            onSelect={handleSelectTemplate}
                          />
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Template Preview Dialog */}
      {selectedTemplate && (
        <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <div className="flex items-start justify-between">
                <div>
                  <DialogTitle className="text-2xl">{selectedTemplate.name}</DialogTitle>
                  <DialogDescription className="mt-2">
                    {selectedTemplate.description}
                  </DialogDescription>
                </div>
                {selectedTemplate.featured && (
                  <Badge variant="secondary" className="gap-1">
                    <Crown className="w-3 h-3" />
                    Featured
                  </Badge>
                )}
              </div>
            </DialogHeader>

            <div className="space-y-4">
              {/* Template Preview */}
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Template Preview</p>
              </div>

              {/* Template Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Category</h4>
                  <Badge>{selectedTemplate.category}</Badge>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2">Color Scheme</h4>
                  <div className="flex gap-2">
                    <div 
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: selectedTemplate.colorScheme.primary }}
                    />
                    <div 
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: selectedTemplate.colorScheme.secondary }}
                    />
                    <div 
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: selectedTemplate.colorScheme.accent }}
                    />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h4 className="text-sm font-semibold mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.tags.map((tag) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button onClick={handleUseTemplate} className="flex-1">
                  Use This Template
                </Button>
                <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

// Template Card Component
interface TemplateCardProps {
  template: FunnelTemplate;
  viewMode: 'grid' | 'list';
  onSelect: (template: FunnelTemplate) => void;
}

function TemplateCard({ template, viewMode, onSelect }: TemplateCardProps) {
  if (viewMode === 'list') {
    return (
      <div 
        onClick={() => onSelect(template)}
        className="flex gap-4 p-4 border rounded-lg hover:border-blue-500 hover:shadow-md transition-all cursor-pointer bg-white dark:bg-gray-950"
      >
        <div className="w-48 h-32 bg-gray-100 dark:bg-gray-800 rounded flex-shrink-0 flex items-center justify-center">
          <p className="text-xs text-gray-400">Preview</p>
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg">{template.name}</h3>
            {template.featured && (
              <Badge variant="secondary" className="gap-1">
                <Crown className="w-3 h-3" />
                Featured
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {template.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {template.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => onSelect(template)}
      className="group border rounded-lg overflow-hidden hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer bg-white dark:bg-gray-950"
    >
      <div className="aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center relative overflow-hidden">
        <p className="text-sm text-gray-400">Preview</p>
        {template.featured && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="gap-1">
              <Crown className="w-3 h-3" />
            </Badge>
          </div>
        )}
        <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold mb-1">{template.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {template.description}
        </p>
        <div className="flex flex-wrap gap-1">
          {template.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
