import type { FunnelTemplate, TemplateCategory, TemplateMetadata } from './template-types';

const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Basic template library - can be expanded with full templates later
export const templateLibrary: FunnelTemplate[] = [
  // Placeholder template - can be expanded with full implementations
  {
    id: 'basic-landing',
    name: 'Basic Landing Page',
    description: 'A simple landing page template',
    category: 'saas',
    thumbnail: '/templates/basic-landing.png',
    previewImages: ['/templates/basic-landing-1.png'],
    tags: ['saas', 'landing'],
    colorScheme: {
      primary: '#3b82f6',
      secondary: '#1e40af',
      accent: '#10b981',
    },
    featured: true,
    sections: [],
    createdAt: typeof window !== 'undefined' ? new Date() : new Date(0),
  },
];

export function getTemplatesByCategory(category: TemplateCategory): FunnelTemplate[] {
  if (category === 'all') {
    return templateLibrary;
  }
  return templateLibrary.filter(t => t.category === category);
}

export function getFeaturedTemplates(): FunnelTemplate[] {
  return templateLibrary.filter(t => t.featured);
}

export function searchTemplates(query: string): FunnelTemplate[] {
  const lowerQuery = query.toLowerCase();
  return templateLibrary.filter(
    t =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

export function getTemplateMetadata(): TemplateMetadata {
  const categories = new Map<TemplateCategory, number>();
  
  templateLibrary.forEach(template => {
    const count = categories.get(template.category) || 0;
    categories.set(template.category, count + 1);
  });

  return {
    totalTemplates: templateLibrary.length,
    categories: Array.from(categories.entries()).map(([category, count]) => ({
      category,
      count,
    })),
    featuredTemplates: templateLibrary.filter(t => t.featured).map(t => t.id),
  };
}





