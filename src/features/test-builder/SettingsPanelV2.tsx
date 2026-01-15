"use client";

import React, { useCallback, useMemo } from 'react';
import { Element } from './store';
import { useTestBuilderV2Store } from './store';
import { HeadingSettings } from './element-settings/HeadingSettings';
import { SubheadingSettings } from './element-settings/SubheadingSettings';
import { TextSettings } from './element-settings/TextSettings';
import { ButtonSettings } from './element-settings/ButtonSettings';
import { GifSettings } from './element-settings/GifSettings';
import { ImageSettings } from './element-settings/ImageSettings';
import { VideoSettings } from './element-settings/VideoSettings';
import { SpacerSettings } from './element-settings/SpacerSettings';
import { DividerSettings } from './element-settings/DividerSettings';
import { IconSettings } from './element-settings/IconSettings';
import { FormSettings } from './element-settings/FormSettings';
import { ListSettings } from './element-settings/ListSettings';
import { ProgressSettings } from './element-settings/ProgressSettings';
import { CountdownSettings } from './element-settings/CountdownSettings';
import { TestimonialSettings } from './element-settings/TestimonialSettings';
import { PricingSettings } from './element-settings/PricingSettings';
import { FaqSettings } from './element-settings/FaqSettings';
import { SocialProofSettings } from './element-settings/SocialProofSettings';
import { AccordionSettings } from './element-settings/AccordionSettings';
import { TabsSettings } from './element-settings/TabsSettings';
import { ModalSettings } from './element-settings/ModalSettings';
import { AlertSettings } from './element-settings/AlertSettings';
import { BadgeSettings } from './element-settings/BadgeSettings';
import { SectionSettings } from './element-settings/SectionSettings';
import { RowSettings } from './element-settings/RowSettings';
import { ColumnSettings } from './element-settings/ColumnSettings';
import LogoShowcaseSettingsPanel from './elements/logo-showcase/LogoShowcaseSettings';
import { GuaranteeSettings } from './element-settings/GuaranteeSettings';
import { FeatureBoxSettings } from './element-settings/FeatureBoxSettings';
import { ComparisonSettings } from './element-settings/ComparisonSettings';
import { StarRatingSettings } from './element-settings/StarRatingSettings';
import {
  AnnouncementSettings,
  ContactFormSettings,
  CTABlockSettings,
  NewsletterSettings,
  HeaderBlockSettings,
  FeatureGridSettings,
  ButtonGroupSettings,
  LogoCloudSettings,
  BannerSettings,
  PollSettings,
  TeamSectionSettings,
  StepsSettings,
  ProductCollectionSettings,
} from './element-settings/HyperUISettings';
import { 
  Trash2, Copy, Type, Heading, AlignLeft, MousePointer, Image, Video, 
  Clock, MessageSquare, DollarSign, Users, TrendingUp, List, HelpCircle,
  Minus, Star, ChevronDown, Columns, Square, AlertCircle, Tag, FileText,
  LucideIcon, Shield, Zap, GitCompare, Award, Megaphone, Layout, Grid, Sparkles, Box
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Element type metadata for better UI
const ELEMENT_META: Record<string, { icon: LucideIcon; label: string; color: string; bgColor: string }> = {
  heading: { icon: Heading, label: 'Heading', color: 'text-blue-500', bgColor: 'bg-blue-500' },
  subheading: { icon: Type, label: 'Subheading', color: 'text-blue-400', bgColor: 'bg-blue-400' },
  text: { icon: AlignLeft, label: 'Paragraph', color: 'text-slate-500', bgColor: 'bg-slate-500' },
  button: { icon: MousePointer, label: 'Button', color: 'text-green-500', bgColor: 'bg-green-500' },
  image: { icon: Image, label: 'Image', color: 'text-purple-500', bgColor: 'bg-purple-500' },
  video: { icon: Video, label: 'Video', color: 'text-red-500', bgColor: 'bg-red-500' },
  gif: { icon: Image, label: 'GIF', color: 'text-pink-500', bgColor: 'bg-pink-500' },
  countdown: { icon: Clock, label: 'Countdown', color: 'text-orange-500', bgColor: 'bg-orange-500' },
  testimonial: { icon: MessageSquare, label: 'Testimonial', color: 'text-cyan-500', bgColor: 'bg-cyan-500' },
  pricing: { icon: DollarSign, label: 'Pricing', color: 'text-emerald-500', bgColor: 'bg-emerald-500' },
  socialproof: { icon: Users, label: 'Social Proof', color: 'text-indigo-500', bgColor: 'bg-indigo-500' },
  progress: { icon: TrendingUp, label: 'Progress', color: 'text-teal-500', bgColor: 'bg-teal-500' },
  list: { icon: List, label: 'List', color: 'text-amber-500', bgColor: 'bg-amber-500' },
  faq: { icon: HelpCircle, label: 'FAQ', color: 'text-violet-500', bgColor: 'bg-violet-500' },
  spacer: { icon: Minus, label: 'Spacer', color: 'text-gray-400', bgColor: 'bg-gray-400' },
  divider: { icon: Minus, label: 'Divider', color: 'text-gray-500', bgColor: 'bg-gray-500' },
  icon: { icon: Star, label: 'Icon', color: 'text-yellow-500', bgColor: 'bg-yellow-500' },
  form: { icon: FileText, label: 'Form', color: 'text-blue-600', bgColor: 'bg-blue-600' },
  accordion: { icon: ChevronDown, label: 'Accordion', color: 'text-rose-500', bgColor: 'bg-rose-500' },
  tabs: { icon: Columns, label: 'Tabs', color: 'text-sky-500', bgColor: 'bg-sky-500' },
  modal: { icon: Square, label: 'Modal', color: 'text-fuchsia-500', bgColor: 'bg-fuchsia-500' },
  alert: { icon: AlertCircle, label: 'Alert', color: 'text-red-400', bgColor: 'bg-red-400' },
  badge: { icon: Tag, label: 'Badge', color: 'text-lime-500', bgColor: 'bg-lime-500' },
  'logo-showcase': { icon: Image, label: 'Logo Showcase', color: 'text-neutral-500', bgColor: 'bg-neutral-500' },
  'guarantee': { icon: Shield, label: 'Guarantee', color: 'text-emerald-500', bgColor: 'bg-emerald-500' },
  'feature-box': { icon: Zap, label: 'Feature Box', color: 'text-blue-500', bgColor: 'bg-blue-500' },
  'comparison': { icon: GitCompare, label: 'Comparison', color: 'text-purple-500', bgColor: 'bg-purple-500' },
  'star-rating': { icon: Award, label: 'Star Rating', color: 'text-yellow-500', bgColor: 'bg-yellow-500' },
  'announcement': { icon: Megaphone, label: 'Announcement', color: 'text-blue-500', bgColor: 'bg-blue-500' },
  'contact-form': { icon: FileText, label: 'Contact Form', color: 'text-green-500', bgColor: 'bg-green-500' },
  'cta-block': { icon: Sparkles, label: 'CTA Block', color: 'text-purple-500', bgColor: 'bg-purple-500' },
  'newsletter': { icon: FileText, label: 'Newsletter', color: 'text-indigo-500', bgColor: 'bg-indigo-500' },
  'header-block': { icon: Heading, label: 'Header Block', color: 'text-slate-500', bgColor: 'bg-slate-500' },
  'feature-grid': { icon: Grid, label: 'Feature Grid', color: 'text-cyan-500', bgColor: 'bg-cyan-500' },
  'button-group': { icon: Columns, label: 'Button Group', color: 'text-green-600', bgColor: 'bg-green-600' },
  'logo-cloud': { icon: Image, label: 'Logo Cloud', color: 'text-neutral-500', bgColor: 'bg-neutral-500' },
  'banner': { icon: Layout, label: 'Banner', color: 'text-amber-500', bgColor: 'bg-amber-500' },
  'poll': { icon: List, label: 'Poll', color: 'text-violet-500', bgColor: 'bg-violet-500' },
  'team-section': { icon: Users, label: 'Team Section', color: 'text-teal-500', bgColor: 'bg-teal-500' },
  'steps': { icon: List, label: 'Steps', color: 'text-orange-500', bgColor: 'bg-orange-500' },
  'product-collection': { icon: Box, label: 'Products', color: 'text-rose-500', bgColor: 'bg-rose-500' },
};

interface SettingsPanelV2Props {
  element: Element;
}

export const SettingsPanelV2 = React.memo(function SettingsPanelV2({ element }: SettingsPanelV2Props) {
  const { updateElement, deleteElement } = useTestBuilderV2Store();

  // Memoize updateProps with useCallback
  const updateProps = useCallback((updates: Record<string, any>) => {
    // Store already merges props, so just pass the updates
    // console.log('🔄 SettingsPanelV2 updateProps called:', { elementId: element.id, updates });
    updateElement(element.id, updates);
  }, [element.id, updateElement]);

  // Memoize node to prevent recreation on every render
  const node = useMemo(() => ({
    id: element.id,
    type: element.type,
    props: element.props,
  }), [element.id, element.type, element.props]);

  const renderSettings = () => {
    switch (element.type) {
      case 'heading':
        return <HeadingSettings node={node} updateProps={updateProps} />;
      
      case 'subheading':
        return <SubheadingSettings node={node} updateProps={updateProps} />;
      
      case 'text':
        return <TextSettings node={node} updateProps={updateProps} />;
      
      case 'button':
        return <ButtonSettings node={node} updateProps={updateProps} />;
      
      case 'image':
        return <ImageSettings node={node} updateProps={updateProps} />;
      
      case 'video':
        return <VideoSettings node={node} updateProps={updateProps} />;
      
      case 'gif':
        return <GifSettings node={node} updateProps={updateProps} />;
      
      case 'spacer':
        return <SpacerSettings node={node} updateProps={updateProps} />;
      
      case 'divider':
        return <DividerSettings node={node} updateProps={updateProps} />;
      
      case 'icon':
        return <IconSettings node={node} updateProps={updateProps} />;
      
      case 'form':
        return <FormSettings node={node} updateProps={updateProps} />;
      
      case 'list':
        return <ListSettings node={node} updateProps={updateProps} />;
      
      case 'progress':
        return <ProgressSettings node={node} updateProps={updateProps} />;
      
      case 'countdown':
        return <CountdownSettings node={node} updateProps={updateProps} />;
      
      case 'testimonial':
        return <TestimonialSettings node={node} updateProps={updateProps} />;
      
      case 'pricing':
        return <PricingSettings node={node} updateProps={updateProps} />;
      
      case 'faq':
        return <FaqSettings node={node} updateProps={updateProps} />;
      
      case 'socialproof':
      case 'social-proof':
        return <SocialProofSettings node={node} updateProps={updateProps} />;
      
      case 'accordion':
        return <AccordionSettings node={node} updateProps={updateProps} />;
      
      case 'tabs':
        return <TabsSettings node={node} updateProps={updateProps} />;
      
      case 'modal':
        return <ModalSettings node={node} updateProps={updateProps} />;
      
      case 'alert':
        return <AlertSettings node={node} updateProps={updateProps} />;
      
      case 'badge':
        return <BadgeSettings node={node} updateProps={updateProps} />;
      
      case 'logo-showcase':
        return <LogoShowcaseSettingsPanel node={node} updateProps={updateProps} />;
      
      case 'guarantee':
        return <GuaranteeSettings elementId={element.id} props={element.props} />;
      
      case 'feature-box':
        return <FeatureBoxSettings elementId={element.id} props={element.props} />;
      
      case 'comparison':
        return <ComparisonSettings elementId={element.id} props={element.props} />;
      
      case 'star-rating':
        return <StarRatingSettings elementId={element.id} props={element.props} />;
      
      case 'announcement':
        return <AnnouncementSettings element={element} onUpdate={updateProps} />;
      
      case 'contact-form':
        return <ContactFormSettings element={element} onUpdate={updateProps} />;
      
      case 'cta-block':
        return <CTABlockSettings element={element} onUpdate={updateProps} />;
      
      case 'newsletter':
        return <NewsletterSettings element={element} onUpdate={updateProps} />;
      
      case 'header-block':
        return <HeaderBlockSettings element={element} onUpdate={updateProps} />;
      
      case 'feature-grid':
        return <FeatureGridSettings element={element} onUpdate={updateProps} />;
      
      case 'button-group':
        return <ButtonGroupSettings element={element} onUpdate={updateProps} />;
      
      case 'logo-cloud':
        return <LogoCloudSettings element={element} onUpdate={updateProps} />;
      
      case 'banner':
        return <BannerSettings element={element} onUpdate={updateProps} />;
      
      case 'poll':
        return <PollSettings element={element} onUpdate={updateProps} />;
      
      case 'team-section':
        return <TeamSectionSettings element={element} onUpdate={updateProps} />;
      
      case 'steps':
        return <StepsSettings element={element} onUpdate={updateProps} />;
      
      case 'product-collection':
        return <ProductCollectionSettings element={element} onUpdate={updateProps} />;
      
      case 'section':
        return <SectionSettings node={node} updateProps={updateProps} />;
      
      case 'row':
        return <RowSettings node={node} updateProps={updateProps} />;
      
      case 'column':
        return <ColumnSettings node={node} updateProps={updateProps} />;
      
      default:
        return (
          <div className="p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Settings for {element.type} coming soon
            </p>
          </div>
        );
    }
  };

  // Get element metadata
  const meta = ELEMENT_META[element.type] || { 
    icon: Square, 
    label: element.type, 
    color: 'text-orange-500', 
    bgColor: 'bg-orange-500' 
  };
  const IconComponent = meta.icon;

  return (
    <TooltipProvider delayDuration={300}>
      <div className="h-full flex flex-col bg-background">
        {/* Header - Kanva Style with Element Color */}
        <div className={cn(
          "px-4 py-3 border-b",
          `${meta.bgColor}/10`,
          "border-border/50"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center",
                meta.bgColor
              )}>
                <IconComponent size={18} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{meta.label} Settings</h3>
                <p className="text-xs text-muted-foreground">Customize your {meta.label.toLowerCase()}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <Copy size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Duplicate Element</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => deleteElement(element.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Delete Element</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Settings Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {renderSettings()}
        </div>
      </div>
    </TooltipProvider>
  );
});
