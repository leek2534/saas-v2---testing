import type { Section } from '../../stubs/store';

export type TemplateCategory = 
  | 'local-business'
  | 'ecommerce'
  | 'saas'
  | 'coaching'
  | 'agency'
  | 'health-wellness'
  | 'real-estate'
  | 'professional-services'
  | 'beauty-salon'
  | 'all';

export interface FunnelTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  thumbnail: string;
  previewImages: string[];
  tags: string[];
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  sections: Section[];
  createdAt: Date;
  featured?: boolean;
  isPremium?: boolean;
}

export interface TemplateMetadata {
  totalTemplates: number;
  categories: {
    category: TemplateCategory;
    count: number;
  }[];
  featuredTemplates: string[]; // template IDs
}
