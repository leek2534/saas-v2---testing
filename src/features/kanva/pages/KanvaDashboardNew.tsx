"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Sparkles,
  Plus,
  Zap,
  TrendingUp,
  Video,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { DashboardSidebar } from '../components/dashboard/DashboardSidebar';
import { RecentProjects } from '../components/dashboard/RecentProjects';
import { TemplateGallery } from '../components/dashboard/TemplateGallery';
import { useEditorStore } from '../lib/editor/store';
import { CANVA_PRESETS } from '../lib/editor/canvasPresets';

// Mock data - replace with real data from API
const mockProjects = [
  {
    id: '1',
    title: 'Instagram Post - Summer Sale',
    width: 1080,
    height: 1080,
    lastEdited: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    status: 'draft' as const,
    isStarred: true,
  },
  {
    id: '2',
    title: 'Facebook Cover - Brand Launch',
    width: 1200,
    height: 630,
    lastEdited: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    status: 'published' as const,
    isStarred: false,
  },
  {
    id: '3',
    title: 'YouTube Thumbnail - Tutorial',
    width: 1280,
    height: 720,
    lastEdited: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    status: 'draft' as const,
    isStarred: false,
  },
  {
    id: '4',
    title: 'Event Flyer - Conference 2024',
    width: 2480,
    height: 3508,
    lastEdited: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    status: 'published' as const,
    isStarred: true,
  },
  {
    id: '5',
    title: 'Instagram Story - Product Launch',
    width: 1080,
    height: 1920,
    lastEdited: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    status: 'draft' as const,
    isStarred: false,
  },
];

const quickActions = [
  {
    title: 'Create with AI',
    description: 'Describe your design and let AI create it',
    icon: Sparkles,
    color: 'from-indigo-500 to-purple-600',
    action: 'ai-design',
  },
  {
    title: 'Video Editor',
    description: 'Create and edit videos with timeline',
    icon: Video,
    color: 'from-blue-500 to-cyan-600',
    action: 'video-editor',
  },
  {
    title: 'Quick Templates',
    description: 'Start with popular templates',
    icon: Zap,
    color: 'from-amber-500 to-orange-600',
    action: 'templates',
  },
  {
    title: 'Brand Kit',
    description: 'Apply your brand to any design',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-600',
    action: 'brand-kit',
  },
];

export function KanvaDashboardNew() {
  const router = useRouter();
  const params = useParams();
  const teamSlug = params.teamSlug as string;
  const setCanvas = useEditorStore((state) => state.setCanvas);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCreateDesign = (type?: string) => {
    if (type === 'custom') {
      // Open custom size modal (will implement modal)
      const width = prompt('Enter width (px):', '1080');
      const height = prompt('Enter height (px):', '1080');
      
      if (width && height) {
        setCanvas({
          width: parseInt(width),
          height: parseInt(height),
          background: { color: '#ffffff' },
        });
        
        const searchParams = new URLSearchParams({
          width: width,
          height: height,
        });
        router.push(`/t/${teamSlug}/kanva/editor?${searchParams.toString()}`);
      }
    } else if (type) {
      // Find preset and set canvas
      const preset = CANVA_PRESETS.find(p => p.id === type);
      if (preset) {
        setCanvas({
          width: preset.width,
          height: preset.height,
          background: { color: '#ffffff' },
        });
      }
      
      router.push(`/t/${teamSlug}/kanva/editor?template=${type}`);
    } else {
      // No type specified, just go to editor
      router.push(`/t/${teamSlug}/kanva/editor`);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Filter projects and templates based on search
    if (query.trim()) {
      console.log('Searching for:', query);
      // In production, this would filter the projects and templates
    }
  };

  const handleEditProject = (id: string) => {
    // Find the project and set canvas dimensions
    const project = mockProjects.find(p => p.id === id);
    if (project) {
      setCanvas({
        width: project.width,
        height: project.height,
        background: { color: '#ffffff' },
      });
    }
    
    router.push(`/t/${teamSlug}/kanva/editor?project=${id}`);
  };

  const handleDuplicateProject = (id: string) => {
    const project = mockProjects.find(p => p.id === id);
    if (project) {
      // Create a copy with new ID
      const newProject = {
        ...project,
        id: `${Date.now()}`,
        title: `${project.title} (Copy)`,
        lastEdited: new Date(),
        status: 'draft' as const,
      };
      
      console.log('Duplicated project:', newProject);
      // In production, save to backend and update state
      alert(`Project "${project.title}" duplicated!`);
    }
  };

  const handleDeleteProject = (id: string) => {
    const project = mockProjects.find(p => p.id === id);
    if (project && confirm(`Delete "${project.title}"?`)) {
      console.log('Deleting project:', id);
      // In production, call API to delete
      alert(`Project "${project.title}" deleted!`);
    }
  };

  const handleShareProject = (id: string) => {
    if (!mounted) return;
    const project = mockProjects.find(p => p.id === id);
    if (project && typeof window !== 'undefined') {
      // Generate shareable link
      const shareUrl = `${window.location.origin}/share/${id}`;
      navigator.clipboard.writeText(shareUrl);
      alert(`Share link copied to clipboard!\n${shareUrl}`);
    }
  };

  const handleToggleStar = (id: string) => {
    console.log('Toggle star for project:', id);
    // In production, update backend and local state
    // For now, just show feedback
    const project = mockProjects.find(p => p.id === id);
    if (project) {
      project.isStarred = !project.isStarred;
      alert(project.isStarred ? 'Added to favorites!' : 'Removed from favorites!');
    }
  };

  const handleSelectTemplate = (templateId: string) => {
    // Find template and set canvas size
    console.log('Selected template:', templateId);
    
    router.push(`/t/${teamSlug}/kanva/editor?template=${templateId}`);
  };

  const handleAiDesign = () => {
    if (!aiPrompt.trim()) {
      alert('Please describe what you want to create');
      return;
    }
    
    console.log('AI Design prompt:', aiPrompt);
    alert(`AI is generating your design: "${aiPrompt}"\n\nThis will integrate with your AI service!`);
    
    // In production, call AI API and create design
    // For now, navigate to editor
    setCanvas({
      width: 1080,
      height: 1080,
      background: { color: '#ffffff' },
    });
    
    router.push(`/t/${teamSlug}/kanva/editor?ai=${encodeURIComponent(aiPrompt)}`);
  };

  if (!mounted) {
    return (
      <div className="flex h-screen bg-background overflow-hidden items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader onCreateDesign={handleCreateDesign} onSearch={handleSearch} />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto p-8 space-y-12">
            {/* Welcome Section */}
            <section className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  👋 Welcome back, Malik!
                </h1>
                <p className="text-lg text-muted-foreground">
                  Continue where you left off or start something new
                </p>
              </div>

              {/* AI Design Input */}
              <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-8 border-2 border-border/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">AI Design Assistant</h3>
                    <p className="text-sm text-muted-foreground">
                      Describe what you want to create and let AI do the work
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Input
                    placeholder="E.g., Create an Instagram post for a coffee shop summer promotion..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAiDesign()}
                    className="flex-1 h-12 text-base"
                  />
                  <Button
                    size="lg"
                    onClick={handleAiDesign}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg px-8"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate
                  </Button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.action}
                      onClick={() => {
                        if (action.action === 'video-editor') {
                          router.push(`/t/${teamSlug}/kanva/video`);
                        } else {
                          console.log(action.action);
                        }
                      }}
                      className="group relative rounded-xl border-2 border-border/50 bg-card hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl p-6 text-left"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold mb-1">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Recent Projects */}
            <RecentProjects
              projects={mockProjects}
              onEdit={handleEditProject}
              onDuplicate={handleDuplicateProject}
              onDelete={handleDeleteProject}
              onShare={handleShareProject}
              onToggleStar={handleToggleStar}
            />

            {/* Template Gallery */}
            <TemplateGallery onSelectTemplate={handleSelectTemplate} />

            {/* Onboarding / Help Section */}
            <section className="bg-gradient-to-br from-muted/50 to-muted/20 rounded-2xl p-8 border-2 border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">New to Kanva?</h3>
                  <p className="text-muted-foreground mb-4">
                    Watch our quick tutorial to get started in minutes
                  </p>
                  <Button variant="outline" size="lg" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Watch Tutorial
                  </Button>
                </div>
                <div className="hidden lg:block">
                  <div className="w-64 h-40 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border-2 border-border/50 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <Plus className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
