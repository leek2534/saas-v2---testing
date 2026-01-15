'use client';

/**
 * HyperUI Components - MIT Licensed components from HyperUI
 * https://www.hyperui.dev/
 * 
 * These are pre-built marketing components with multiple preset variants
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { 
  X, Bell, Megaphone, Mail, Send, Phone, MapPin, Clock,
  ChevronDown, ChevronRight, Users, Zap, Shield, Heart,
  Star, Check, ArrowRight, Play, ExternalLink, Menu,
  Grid, List, ShoppingCart, Package, Truck, CreditCard
} from 'lucide-react';

// ============================================
// ANNOUNCEMENT COMPONENT
// ============================================
export interface AnnouncementProps {
  variant: 'base' | 'base-dark' | 'dismissible' | 'fixed' | 'floating';
  text: string;
  linkText?: string;
  linkUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  showIcon?: boolean;
  dismissible?: boolean;
}

export const ANNOUNCEMENT_PRESETS: Record<string, Partial<AnnouncementProps>> = {
  'base': {
    variant: 'base',
    text: '🎉 New feature available! Check out our latest update.',
    linkText: 'Learn more',
    linkUrl: '#',
    backgroundColor: '#3b82f6',
    textColor: '#ffffff',
    showIcon: true,
    dismissible: false,
  },
  'sale': {
    variant: 'base',
    text: '🔥 Flash Sale! 50% off all products for the next 24 hours.',
    linkText: 'Shop now',
    linkUrl: '#',
    backgroundColor: '#ef4444',
    textColor: '#ffffff',
    showIcon: true,
    dismissible: true,
  },
  'info': {
    variant: 'floating',
    text: 'ℹ️ Scheduled maintenance on Sunday 2am-4am EST.',
    backgroundColor: '#f59e0b',
    textColor: '#1f2937',
    showIcon: true,
    dismissible: true,
  },
  'success': {
    variant: 'base',
    text: '✅ Your order has been confirmed!',
    backgroundColor: '#10b981',
    textColor: '#ffffff',
    showIcon: true,
    dismissible: true,
  },
  'dark': {
    variant: 'base-dark',
    text: '🚀 Version 2.0 is here with amazing new features!',
    linkText: 'See what\'s new',
    linkUrl: '#',
    backgroundColor: '#1f2937',
    textColor: '#ffffff',
    showIcon: true,
    dismissible: false,
  },
};

export function AnnouncementElement({
  variant = 'base',
  text,
  linkText,
  linkUrl,
  backgroundColor = '#3b82f6',
  textColor = '#ffffff',
  showIcon = true,
  dismissible = false,
}: AnnouncementProps) {
  const [isDismissed, setIsDismissed] = React.useState(false);

  if (isDismissed) return null;

  const isFloating = variant === 'floating';
  const isFixed = variant === 'fixed';

  return (
    <div
      className={cn(
        'relative px-4 py-3 text-center',
        isFloating && 'mx-4 my-2 rounded-lg shadow-lg',
        isFixed && 'fixed top-0 left-0 right-0 z-50'
      )}
      style={{ backgroundColor, color: textColor }}
    >
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {showIcon && <Bell className="w-4 h-4 flex-shrink-0" />}
        <span className="text-sm font-medium">{text}</span>
        {linkText && linkUrl && (
          <a
            href={linkUrl}
            className="inline-flex items-center gap-1 text-sm font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            {linkText}
            <ArrowRight className="w-3 h-3" />
          </a>
        )}
      </div>
      {dismissible && (
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// ============================================
// CONTACT FORM COMPONENT
// ============================================
export interface ContactFormProps {
  variant: 'simple' | 'with-info' | 'split' | 'minimal';
  title?: string;
  subtitle?: string;
  showPhone?: boolean;
  showEmail?: boolean;
  showAddress?: boolean;
  buttonText?: string;
  buttonColor?: string;
  backgroundColor?: string;
}

export const CONTACT_FORM_PRESETS: Record<string, Partial<ContactFormProps>> = {
  'simple': {
    variant: 'simple',
    title: 'Get in Touch',
    subtitle: 'We\'d love to hear from you. Send us a message!',
    buttonText: 'Send Message',
    buttonColor: '#3b82f6',
    backgroundColor: '#ffffff',
  },
  'with-info': {
    variant: 'with-info',
    title: 'Contact Us',
    subtitle: 'Have questions? Reach out to us anytime.',
    showPhone: true,
    showEmail: true,
    showAddress: true,
    buttonText: 'Submit',
    buttonColor: '#10b981',
    backgroundColor: '#f9fafb',
  },
  'split': {
    variant: 'split',
    title: 'Let\'s Talk',
    subtitle: 'Fill out the form and we\'ll get back to you within 24 hours.',
    showPhone: true,
    showEmail: true,
    buttonText: 'Send',
    buttonColor: '#8b5cf6',
    backgroundColor: '#ffffff',
  },
  'minimal': {
    variant: 'minimal',
    title: 'Quick Contact',
    buttonText: 'Submit',
    buttonColor: '#1f2937',
    backgroundColor: 'transparent',
  },
};

export function ContactFormElement({
  variant = 'simple',
  title = 'Get in Touch',
  subtitle,
  showPhone = false,
  showEmail = false,
  showAddress = false,
  buttonText = 'Send Message',
  buttonColor = '#3b82f6',
  backgroundColor = '#ffffff',
}: ContactFormProps) {
  return (
    <div className="w-full p-6 rounded-xl" style={{ backgroundColor }}>
      <div className={cn(
        'grid gap-8',
        variant === 'split' && 'lg:grid-cols-2'
      )}>
        {/* Info Section */}
        {(variant === 'with-info' || variant === 'split') && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
              {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
            </div>
            <div className="space-y-4">
              {showPhone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">+1 (555) 123-4567</span>
                </div>
              )}
              {showEmail && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">hello@example.com</span>
                </div>
              )}
              {showAddress && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">123 Main St, City, ST 12345</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Form Section */}
        <div className="space-y-4">
          {variant === 'simple' && (
            <>
              <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
              {subtitle && <p className="text-gray-600">{subtitle}</p>}
            </>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="First Name"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <textarea
            placeholder="Your Message"
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          />
          <button
            className="w-full py-3 px-6 rounded-lg font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: buttonColor }}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// CTA BLOCK COMPONENT
// ============================================
export interface CTABlockProps {
  variant: 'centered' | 'split' | 'with-image' | 'gradient' | 'minimal';
  title: string;
  subtitle?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  primaryButtonColor?: string;
  imageUrl?: string;
  backgroundColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

export const CTA_BLOCK_PRESETS: Record<string, Partial<CTABlockProps>> = {
  'centered': {
    variant: 'centered',
    title: 'Ready to get started?',
    subtitle: 'Join thousands of satisfied customers using our platform.',
    primaryButtonText: 'Get Started Free',
    secondaryButtonText: 'Learn More',
    primaryButtonColor: '#3b82f6',
    backgroundColor: '#f9fafb',
  },
  'gradient': {
    variant: 'gradient',
    title: 'Transform Your Business Today',
    subtitle: 'Start your free trial and see the difference.',
    primaryButtonText: 'Start Free Trial',
    primaryButtonColor: '#ffffff',
    gradientFrom: '#667eea',
    gradientTo: '#764ba2',
  },
  'split': {
    variant: 'split',
    title: 'Build Something Amazing',
    subtitle: 'Our tools help you create stunning websites in minutes.',
    primaryButtonText: 'Try It Now',
    imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop',
    primaryButtonColor: '#10b981',
    backgroundColor: '#ffffff',
  },
  'minimal': {
    variant: 'minimal',
    title: 'Subscribe to our newsletter',
    primaryButtonText: 'Subscribe',
    primaryButtonColor: '#1f2937',
    backgroundColor: 'transparent',
  },
  'urgent': {
    variant: 'gradient',
    title: 'Limited Time Offer!',
    subtitle: 'Get 50% off when you sign up today. Offer ends soon!',
    primaryButtonText: 'Claim Offer',
    primaryButtonColor: '#ffffff',
    gradientFrom: '#ef4444',
    gradientTo: '#f97316',
  },
};

export function CTABlockElement({
  variant = 'centered',
  title,
  subtitle,
  primaryButtonText = 'Get Started',
  secondaryButtonText,
  primaryButtonColor = '#3b82f6',
  imageUrl,
  backgroundColor = '#f9fafb',
  gradientFrom = '#667eea',
  gradientTo = '#764ba2',
}: CTABlockProps) {
  const isGradient = variant === 'gradient';
  const isSplit = variant === 'split' || variant === 'with-image';

  const bgStyle = isGradient
    ? { background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }
    : { backgroundColor };

  const textColor = isGradient ? 'text-white' : 'text-gray-900';
  const subtitleColor = isGradient ? 'text-white/80' : 'text-gray-600';

  return (
    <div className="w-full p-8 lg:p-12 rounded-2xl" style={bgStyle}>
      <div className={cn(
        'flex flex-col gap-8',
        isSplit && 'lg:flex-row lg:items-center'
      )}>
        <div className={cn('flex-1 text-center', isSplit && 'lg:text-left')}>
          <h2 className={cn('text-3xl lg:text-4xl font-bold', textColor)}>{title}</h2>
          {subtitle && (
            <p className={cn('mt-4 text-lg', subtitleColor)}>{subtitle}</p>
          )}
          <div className={cn(
            'mt-8 flex flex-wrap gap-4',
            !isSplit && 'justify-center'
          )}>
            <button
              className="px-8 py-3 rounded-lg font-semibold transition-all hover:opacity-90 shadow-lg"
              style={{
                backgroundColor: isGradient ? '#ffffff' : primaryButtonColor,
                color: isGradient ? gradientFrom : '#ffffff',
              }}
            >
              {primaryButtonText}
            </button>
            {secondaryButtonText && (
              <button className={cn(
                'px-8 py-3 rounded-lg font-semibold border-2 transition-all hover:opacity-80',
                isGradient ? 'border-white text-white' : 'border-gray-300 text-gray-700'
              )}>
                {secondaryButtonText}
              </button>
            )}
          </div>
        </div>
        {isSplit && imageUrl && (
          <div className="flex-1">
            <img
              src={imageUrl}
              alt="CTA"
              className="w-full h-64 lg:h-80 object-cover rounded-xl shadow-xl"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// NEWSLETTER COMPONENT
// ============================================
export interface NewsletterProps {
  variant: 'simple' | 'with-benefits' | 'inline' | 'card';
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonColor?: string;
  backgroundColor?: string;
  benefits?: string[];
}

export const NEWSLETTER_PRESETS: Record<string, Partial<NewsletterProps>> = {
  'simple': {
    variant: 'simple',
    title: 'Subscribe to our newsletter',
    subtitle: 'Get the latest updates delivered to your inbox.',
    buttonText: 'Subscribe',
    buttonColor: '#3b82f6',
    backgroundColor: '#f9fafb',
  },
  'with-benefits': {
    variant: 'with-benefits',
    title: 'Join Our Community',
    subtitle: 'Subscribe and get exclusive access to:',
    buttonText: 'Join Now',
    buttonColor: '#10b981',
    backgroundColor: '#ffffff',
    benefits: ['Weekly tips & tricks', 'Exclusive discounts', 'Early access to new features'],
  },
  'inline': {
    variant: 'inline',
    title: 'Stay Updated',
    buttonText: 'Subscribe',
    buttonColor: '#8b5cf6',
    backgroundColor: 'transparent',
  },
  'card': {
    variant: 'card',
    title: 'Newsletter',
    subtitle: 'Don\'t miss out on our latest news and updates.',
    buttonText: 'Sign Up',
    buttonColor: '#1f2937',
    backgroundColor: '#ffffff',
  },
};

export function NewsletterElement({
  variant = 'simple',
  title = 'Subscribe to our newsletter',
  subtitle,
  buttonText = 'Subscribe',
  buttonColor = '#3b82f6',
  backgroundColor = '#f9fafb',
  benefits = [],
}: NewsletterProps) {
  const isInline = variant === 'inline';
  const isCard = variant === 'card';

  return (
    <div
      className={cn(
        'w-full p-6 rounded-xl',
        isCard && 'shadow-lg border border-gray-100'
      )}
      style={{ backgroundColor }}
    >
      <div className={cn(
        'flex flex-col gap-4',
        isInline && 'sm:flex-row sm:items-center'
      )}>
        <div className={cn('flex-1', isInline && 'sm:flex-initial')}>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          {subtitle && <p className="mt-1 text-gray-600">{subtitle}</p>}
          {benefits.length > 0 && (
            <ul className="mt-4 space-y-2">
              {benefits.map((benefit, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-600">
                  <Check className="w-4 h-4 text-green-500" />
                  {benefit}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={cn(
          'flex gap-2',
          isInline ? 'flex-1' : 'flex-col sm:flex-row'
        )}>
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <button
            className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90 whitespace-nowrap"
            style={{ backgroundColor: buttonColor }}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// HEADER BLOCK COMPONENT
// ============================================
export interface HeaderBlockProps {
  variant: 'centered' | 'left-aligned' | 'with-eyebrow' | 'with-badge';
  title: string;
  subtitle?: string;
  eyebrow?: string;
  badge?: string;
  alignment?: 'left' | 'center' | 'right';
  titleColor?: string;
  subtitleColor?: string;
}

export const HEADER_BLOCK_PRESETS: Record<string, Partial<HeaderBlockProps>> = {
  'centered': {
    variant: 'centered',
    title: 'Build Something Amazing',
    subtitle: 'Everything you need to create stunning websites and applications.',
    alignment: 'center',
    titleColor: '#1f2937',
    subtitleColor: '#6b7280',
  },
  'with-eyebrow': {
    variant: 'with-eyebrow',
    title: 'Our Features',
    subtitle: 'Discover what makes us different from the competition.',
    eyebrow: 'WHY CHOOSE US',
    alignment: 'center',
    titleColor: '#1f2937',
    subtitleColor: '#6b7280',
  },
  'with-badge': {
    variant: 'with-badge',
    title: 'Introducing Our New Product',
    subtitle: 'The most powerful tool for modern developers.',
    badge: 'NEW',
    alignment: 'center',
    titleColor: '#1f2937',
    subtitleColor: '#6b7280',
  },
  'left-aligned': {
    variant: 'left-aligned',
    title: 'Get Started Today',
    subtitle: 'Join thousands of happy customers.',
    alignment: 'left',
    titleColor: '#1f2937',
    subtitleColor: '#6b7280',
  },
};

export function HeaderBlockElement({
  variant = 'centered',
  title,
  subtitle,
  eyebrow,
  badge,
  alignment = 'center',
  titleColor = '#1f2937',
  subtitleColor = '#6b7280',
}: HeaderBlockProps) {
  const alignClass = alignment === 'left' ? 'text-left' : alignment === 'right' ? 'text-right' : 'text-center';

  return (
    <div className={cn('w-full py-4', alignClass)}>
      {eyebrow && (
        <p className="text-sm font-semibold tracking-wider text-blue-600 uppercase mb-2">
          {eyebrow}
        </p>
      )}
      <div className="flex items-center gap-3 justify-center flex-wrap">
        <h2 className="text-3xl lg:text-4xl font-bold" style={{ color: titleColor }}>
          {title}
        </h2>
        {badge && (
          <span className="px-3 py-1 text-xs font-bold text-white bg-blue-600 rounded-full">
            {badge}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: subtitleColor }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ============================================
// FEATURE GRID COMPONENT
// ============================================
export interface FeatureGridProps {
  variant: '2-column' | '3-column' | '4-column' | 'with-icons' | 'cards';
  features: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
  backgroundColor?: string;
  iconColor?: string;
}

export const FEATURE_GRID_PRESETS: Record<string, Partial<FeatureGridProps>> = {
  '3-column': {
    variant: '3-column',
    features: [
      { icon: 'Zap', title: 'Lightning Fast', description: 'Optimized for speed and performance.' },
      { icon: 'Shield', title: 'Secure', description: 'Enterprise-grade security built in.' },
      { icon: 'Heart', title: 'Easy to Use', description: 'Intuitive interface anyone can master.' },
    ],
    backgroundColor: '#ffffff',
    iconColor: '#3b82f6',
  },
  '4-column': {
    variant: '4-column',
    features: [
      { icon: 'Zap', title: 'Fast', description: 'Blazing fast performance.' },
      { icon: 'Shield', title: 'Secure', description: 'Bank-level security.' },
      { icon: 'Heart', title: 'Loved', description: 'Trusted by millions.' },
      { icon: 'Star', title: 'Rated', description: '5-star reviews.' },
    ],
    backgroundColor: '#f9fafb',
    iconColor: '#10b981',
  },
  'cards': {
    variant: 'cards',
    features: [
      { icon: 'Zap', title: 'Performance', description: 'Built for speed from the ground up.' },
      { icon: 'Shield', title: 'Security', description: 'Your data is always protected.' },
      { icon: 'Heart', title: 'Support', description: '24/7 customer support available.' },
    ],
    backgroundColor: '#ffffff',
    iconColor: '#8b5cf6',
  },
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Zap, Shield, Heart, Star, Check, Users, Clock, Mail, Phone, Package, Truck, CreditCard,
};

export function FeatureGridElement({
  variant = '3-column',
  features = [],
  backgroundColor = '#ffffff',
  iconColor = '#3b82f6',
}: FeatureGridProps) {
  const columns = variant === '2-column' ? 2 : variant === '4-column' ? 4 : 3;
  const isCards = variant === 'cards';

  return (
    <div className="w-full p-6" style={{ backgroundColor }}>
      <div className={cn(
        'grid gap-8',
        columns === 2 && 'sm:grid-cols-2',
        columns === 3 && 'sm:grid-cols-2 lg:grid-cols-3',
        columns === 4 && 'sm:grid-cols-2 lg:grid-cols-4'
      )}>
        {features.map((feature, i) => {
          const IconComponent = feature.icon ? iconMap[feature.icon] || Zap : Zap;
          return (
            <div
              key={i}
              className={cn(
                'text-center p-6',
                isCards && 'bg-white rounded-xl shadow-md border border-gray-100'
              )}
            >
              <div
                className="w-12 h-12 mx-auto rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: `${iconColor}15` }}
              >
                <IconComponent className="w-6 h-6" style={{ color: iconColor }} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// BUTTON GROUP COMPONENT
// ============================================
export interface ButtonGroupProps {
  variant: 'horizontal' | 'vertical' | 'stacked' | 'icon-buttons';
  buttons: Array<{
    text: string;
    style: 'primary' | 'secondary' | 'outline' | 'ghost';
    icon?: string;
  }>;
  alignment?: 'left' | 'center' | 'right';
  size?: 'sm' | 'md' | 'lg';
  primaryColor?: string;
}

export const BUTTON_GROUP_PRESETS: Record<string, Partial<ButtonGroupProps>> = {
  'primary-secondary': {
    variant: 'horizontal',
    buttons: [
      { text: 'Get Started', style: 'primary' },
      { text: 'Learn More', style: 'secondary' },
    ],
    alignment: 'center',
    size: 'md',
    primaryColor: '#3b82f6',
  },
  'cta-pair': {
    variant: 'horizontal',
    buttons: [
      { text: 'Start Free Trial', style: 'primary' },
      { text: 'Watch Demo', style: 'outline', icon: 'Play' },
    ],
    alignment: 'center',
    size: 'lg',
    primaryColor: '#10b981',
  },
  'action-stack': {
    variant: 'stacked',
    buttons: [
      { text: 'Sign Up Now', style: 'primary' },
      { text: 'Already have an account? Sign in', style: 'ghost' },
    ],
    alignment: 'center',
    size: 'md',
    primaryColor: '#8b5cf6',
  },
};

export function ButtonGroupElement({
  variant = 'horizontal',
  buttons = [],
  alignment = 'center',
  size = 'md',
  primaryColor = '#3b82f6',
}: ButtonGroupProps) {
  const alignClass = alignment === 'left' ? 'justify-start' : alignment === 'right' ? 'justify-end' : 'justify-center';
  const sizeClass = size === 'sm' ? 'px-4 py-2 text-sm' : size === 'lg' ? 'px-8 py-4 text-lg' : 'px-6 py-3';

  const getButtonStyle = (style: string) => {
    switch (style) {
      case 'primary':
        return { backgroundColor: primaryColor, color: '#ffffff' };
      case 'secondary':
        return { backgroundColor: '#f3f4f6', color: '#374151' };
      case 'outline':
        return { backgroundColor: 'transparent', color: primaryColor, border: `2px solid ${primaryColor}` };
      case 'ghost':
        return { backgroundColor: 'transparent', color: '#6b7280' };
      default:
        return {};
    }
  };

  return (
    <div className={cn(
      'flex gap-4 flex-wrap',
      alignClass,
      variant === 'vertical' || variant === 'stacked' ? 'flex-col items-center' : 'flex-row'
    )}>
      {buttons.map((button, i) => {
        const IconComponent = button.icon ? iconMap[button.icon] || null : null;
        return (
          <button
            key={i}
            className={cn(
              'rounded-lg font-semibold transition-all hover:opacity-90 flex items-center gap-2',
              sizeClass,
              variant === 'stacked' && 'w-full max-w-xs'
            )}
            style={getButtonStyle(button.style)}
          >
            {IconComponent && <IconComponent className="w-5 h-5" />}
            {button.text}
          </button>
        );
      })}
    </div>
  );
}

// ============================================
// LOGO CLOUD COMPONENT
// ============================================
export interface LogoCloudProps {
  variant: 'simple' | 'with-title' | 'grid' | 'scrolling';
  title?: string;
  logos: Array<{
    name: string;
    imageUrl?: string;
  }>;
  grayscale?: boolean;
  backgroundColor?: string;
}

export const LOGO_CLOUD_PRESETS: Record<string, Partial<LogoCloudProps>> = {
  'simple': {
    variant: 'simple',
    logos: [
      { name: 'Company 1' },
      { name: 'Company 2' },
      { name: 'Company 3' },
      { name: 'Company 4' },
      { name: 'Company 5' },
    ],
    grayscale: true,
    backgroundColor: '#ffffff',
  },
  'with-title': {
    variant: 'with-title',
    title: 'Trusted by leading companies',
    logos: [
      { name: 'Acme Inc' },
      { name: 'Globex' },
      { name: 'Initech' },
      { name: 'Umbrella' },
    ],
    grayscale: true,
    backgroundColor: '#f9fafb',
  },
  'grid': {
    variant: 'grid',
    title: 'Our Partners',
    logos: [
      { name: 'Partner 1' },
      { name: 'Partner 2' },
      { name: 'Partner 3' },
      { name: 'Partner 4' },
      { name: 'Partner 5' },
      { name: 'Partner 6' },
    ],
    grayscale: false,
    backgroundColor: '#ffffff',
  },
};

export function LogoCloudElement({
  variant = 'simple',
  title,
  logos = [],
  grayscale = true,
  backgroundColor = '#ffffff',
}: LogoCloudProps) {
  const isGrid = variant === 'grid';

  return (
    <div className="w-full p-8" style={{ backgroundColor }}>
      {title && (
        <p className="text-center text-sm font-medium text-gray-500 uppercase tracking-wider mb-8">
          {title}
        </p>
      )}
      <div className={cn(
        'flex items-center gap-8',
        isGrid ? 'flex-wrap justify-center' : 'justify-center overflow-hidden'
      )}>
        {logos.map((logo, i) => (
          <div
            key={i}
            className={cn(
              'flex items-center justify-center h-12 px-6',
              grayscale && 'opacity-50 hover:opacity-100 transition-opacity'
            )}
          >
            {logo.imageUrl ? (
              <img src={logo.imageUrl} alt={logo.name} className="h-8 object-contain" />
            ) : (
              <span className="text-xl font-bold text-gray-400">{logo.name}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// BANNER COMPONENT
// ============================================
export interface BannerProps {
  variant: 'info' | 'success' | 'warning' | 'error' | 'promo';
  text: string;
  linkText?: string;
  linkUrl?: string;
  dismissible?: boolean;
  icon?: boolean;
}

export const BANNER_PRESETS: Record<string, Partial<BannerProps>> = {
  'info': {
    variant: 'info',
    text: 'New features are now available. Check out what\'s new!',
    linkText: 'Learn more',
    linkUrl: '#',
    dismissible: true,
    icon: true,
  },
  'success': {
    variant: 'success',
    text: 'Your changes have been saved successfully.',
    dismissible: true,
    icon: true,
  },
  'warning': {
    variant: 'warning',
    text: 'Your trial expires in 3 days. Upgrade now to keep access.',
    linkText: 'Upgrade',
    linkUrl: '#',
    dismissible: false,
    icon: true,
  },
  'promo': {
    variant: 'promo',
    text: '🎉 Black Friday Sale! Use code SAVE50 for 50% off.',
    linkText: 'Shop now',
    linkUrl: '#',
    dismissible: true,
    icon: false,
  },
};

export function BannerElement({
  variant = 'info',
  text,
  linkText,
  linkUrl,
  dismissible = true,
  icon = true,
}: BannerProps) {
  const [isDismissed, setIsDismissed] = React.useState(false);

  if (isDismissed) return null;

  const variantStyles: Record<string, { bg: string; text: string; border: string }> = {
    info: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
    success: { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200' },
    warning: { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-200' },
    error: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200' },
    promo: { bg: 'bg-purple-600', text: 'text-white', border: 'border-purple-700' },
  };

  const styles = variantStyles[variant] || variantStyles.info;

  return (
    <div className={cn(
      'relative px-4 py-3 rounded-lg border flex items-center justify-between gap-4',
      styles.bg,
      styles.text,
      styles.border
    )}>
      <div className="flex items-center gap-3 flex-1">
        {icon && <Bell className="w-5 h-5 flex-shrink-0" />}
        <p className="text-sm font-medium">{text}</p>
        {linkText && linkUrl && (
          <a href={linkUrl} className="text-sm font-semibold underline hover:no-underline whitespace-nowrap">
            {linkText} →
          </a>
        )}
      </div>
      {dismissible && (
        <button onClick={() => setIsDismissed(true)} className="p-1 hover:opacity-70">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// ============================================
// POLL COMPONENT
// ============================================
export interface PollProps {
  variant: 'simple' | 'with-results' | 'image-options';
  question: string;
  options: Array<{
    text: string;
    votes?: number;
    imageUrl?: string;
  }>;
  showResults?: boolean;
  totalVotes?: number;
  backgroundColor?: string;
  accentColor?: string;
}

export const POLL_PRESETS: Record<string, Partial<PollProps>> = {
  'simple': {
    variant: 'simple',
    question: 'What feature would you like to see next?',
    options: [
      { text: 'Dark mode', votes: 45 },
      { text: 'Mobile app', votes: 32 },
      { text: 'API access', votes: 23 },
    ],
    showResults: false,
    backgroundColor: '#ffffff',
    accentColor: '#3b82f6',
  },
  'with-results': {
    variant: 'with-results',
    question: 'How satisfied are you with our service?',
    options: [
      { text: 'Very satisfied', votes: 156 },
      { text: 'Satisfied', votes: 89 },
      { text: 'Neutral', votes: 34 },
      { text: 'Unsatisfied', votes: 12 },
    ],
    showResults: true,
    totalVotes: 291,
    backgroundColor: '#f9fafb',
    accentColor: '#10b981',
  },
};

export function PollElement({
  variant = 'simple',
  question,
  options = [],
  showResults = false,
  totalVotes = 0,
  backgroundColor = '#ffffff',
  accentColor = '#3b82f6',
}: PollProps) {
  const total = totalVotes || options.reduce((sum, opt) => sum + (opt.votes || 0), 0);

  return (
    <div className="w-full p-6 rounded-xl border border-gray-200" style={{ backgroundColor }}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{question}</h3>
      <div className="space-y-3">
        {options.map((option, i) => {
          const percentage = total > 0 ? Math.round(((option.votes || 0) / total) * 100) : 0;
          return (
            <div key={i}>
              {showResults ? (
                <div className="relative">
                  <div
                    className="absolute inset-0 rounded-lg opacity-20"
                    style={{ backgroundColor: accentColor, width: `${percentage}%` }}
                  />
                  <div className="relative px-4 py-3 flex items-center justify-between">
                    <span className="font-medium text-gray-900">{option.text}</span>
                    <span className="text-sm text-gray-600">{percentage}%</span>
                  </div>
                </div>
              ) : (
                <button
                  className="w-full px-4 py-3 text-left rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors font-medium text-gray-900"
                >
                  {option.text}
                </button>
              )}
            </div>
          );
        })}
      </div>
      {showResults && (
        <p className="mt-4 text-sm text-gray-500 text-center">{total} votes</p>
      )}
    </div>
  );
}

// ============================================
// TEAM SECTION COMPONENT
// ============================================
export interface TeamSectionProps {
  variant: 'grid' | 'cards' | 'list' | 'minimal';
  title?: string;
  subtitle?: string;
  members: Array<{
    name: string;
    role: string;
    imageUrl?: string;
    bio?: string;
  }>;
  columns?: 2 | 3 | 4;
  backgroundColor?: string;
}

export const TEAM_SECTION_PRESETS: Record<string, Partial<TeamSectionProps>> = {
  'grid': {
    variant: 'grid',
    title: 'Meet Our Team',
    subtitle: 'The talented people behind our success.',
    members: [
      { name: 'John Doe', role: 'CEO & Founder', imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face' },
      { name: 'Jane Smith', role: 'CTO', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face' },
      { name: 'Mike Johnson', role: 'Lead Designer', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face' },
    ],
    columns: 3,
    backgroundColor: '#ffffff',
  },
  'cards': {
    variant: 'cards',
    title: 'Our Leadership',
    members: [
      { name: 'Sarah Wilson', role: 'CEO', bio: 'Visionary leader with 15+ years experience.' },
      { name: 'Tom Brown', role: 'CTO', bio: 'Tech expert driving innovation.' },
    ],
    columns: 2,
    backgroundColor: '#f9fafb',
  },
};

export function TeamSectionElement({
  variant = 'grid',
  title,
  subtitle,
  members = [],
  columns = 3,
  backgroundColor = '#ffffff',
}: TeamSectionProps) {
  const isCards = variant === 'cards';

  return (
    <div className="w-full p-8" style={{ backgroundColor }}>
      {title && (
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
        </div>
      )}
      <div className={cn(
        'grid gap-8',
        columns === 2 && 'sm:grid-cols-2',
        columns === 3 && 'sm:grid-cols-2 lg:grid-cols-3',
        columns === 4 && 'sm:grid-cols-2 lg:grid-cols-4'
      )}>
        {members.map((member, i) => (
          <div
            key={i}
            className={cn(
              'text-center',
              isCards && 'bg-white p-6 rounded-xl shadow-md'
            )}
          >
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gray-200 mb-4">
              {member.imageUrl ? (
                <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Users className="w-10 h-10 text-gray-400" />
                </div>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
            <p className="text-sm text-blue-600">{member.role}</p>
            {member.bio && <p className="mt-2 text-sm text-gray-600">{member.bio}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// STEPS COMPONENT
// ============================================
export interface StepsProps {
  variant: 'horizontal' | 'vertical' | 'numbered' | 'icons';
  title?: string;
  steps: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
  accentColor?: string;
  backgroundColor?: string;
}

export const STEPS_PRESETS: Record<string, Partial<StepsProps>> = {
  'numbered': {
    variant: 'numbered',
    title: 'How It Works',
    steps: [
      { title: 'Sign Up', description: 'Create your free account in seconds.' },
      { title: 'Customize', description: 'Set up your preferences and profile.' },
      { title: 'Launch', description: 'Go live and start growing.' },
    ],
    accentColor: '#3b82f6',
    backgroundColor: '#ffffff',
  },
  'icons': {
    variant: 'icons',
    title: 'Getting Started',
    steps: [
      { title: 'Create Account', description: 'Sign up for free.', icon: 'Users' },
      { title: 'Add Content', description: 'Upload your files.', icon: 'Package' },
      { title: 'Share', description: 'Invite your team.', icon: 'Mail' },
    ],
    accentColor: '#10b981',
    backgroundColor: '#f9fafb',
  },
  'vertical': {
    variant: 'vertical',
    title: 'Our Process',
    steps: [
      { title: 'Discovery', description: 'We learn about your needs and goals.' },
      { title: 'Design', description: 'We create beautiful, functional designs.' },
      { title: 'Development', description: 'We build your solution with care.' },
      { title: 'Delivery', description: 'We launch and support your project.' },
    ],
    accentColor: '#8b5cf6',
    backgroundColor: '#ffffff',
  },
};

export function StepsElement({
  variant = 'numbered',
  title,
  steps = [],
  accentColor = '#3b82f6',
  backgroundColor = '#ffffff',
}: StepsProps) {
  const isVertical = variant === 'vertical';
  const isIcons = variant === 'icons';

  return (
    <div className="w-full p-8" style={{ backgroundColor }}>
      {title && (
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">{title}</h2>
      )}
      <div className={cn(
        'relative',
        isVertical ? 'space-y-8' : 'grid gap-8 sm:grid-cols-2 lg:grid-cols-3'
      )}>
        {steps.map((step, i) => {
          const IconComponent = step.icon ? iconMap[step.icon] || Zap : null;
          return (
            <div key={i} className={cn(
              'relative',
              isVertical && 'pl-12'
            )}>
              {/* Step indicator */}
              <div
                className={cn(
                  'flex items-center justify-center rounded-full font-bold text-white',
                  isVertical ? 'absolute left-0 top-0 w-8 h-8 text-sm' : 'w-12 h-12 mx-auto mb-4 text-lg'
                )}
                style={{ backgroundColor: accentColor }}
              >
                {isIcons && IconComponent ? (
                  <IconComponent className="w-6 h-6" />
                ) : (
                  i + 1
                )}
              </div>
              <div className={cn(!isVertical && 'text-center')}>
                <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-1 text-gray-600">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// PRODUCT COLLECTION COMPONENT
// ============================================
export interface ProductCollectionProps {
  variant: 'grid' | 'carousel' | 'featured' | 'list';
  title?: string;
  products: Array<{
    name: string;
    price: string;
    originalPrice?: string;
    imageUrl: string;
    badge?: string;
  }>;
  columns?: 2 | 3 | 4;
  backgroundColor?: string;
}

export const PRODUCT_COLLECTION_PRESETS: Record<string, Partial<ProductCollectionProps>> = {
  'grid': {
    variant: 'grid',
    title: 'Featured Products',
    products: [
      { name: 'Product One', price: '$49.99', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop' },
      { name: 'Product Two', price: '$79.99', originalPrice: '$99.99', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', badge: 'Sale' },
      { name: 'Product Three', price: '$129.99', imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop', badge: 'New' },
    ],
    columns: 3,
    backgroundColor: '#ffffff',
  },
  'featured': {
    variant: 'featured',
    title: 'Best Sellers',
    products: [
      { name: 'Premium Headphones', price: '$299.99', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop', badge: 'Best Seller' },
    ],
    backgroundColor: '#f9fafb',
  },
};

export function ProductCollectionElement({
  variant = 'grid',
  title,
  products = [],
  columns = 3,
  backgroundColor = '#ffffff',
}: ProductCollectionProps) {
  const isFeatured = variant === 'featured';

  return (
    <div className="w-full p-8" style={{ backgroundColor }}>
      {title && (
        <h2 className="text-2xl font-bold text-gray-900 mb-8">{title}</h2>
      )}
      {isFeatured && products[0] ? (
        <div className="relative rounded-xl overflow-hidden">
          <img
            src={products[0].imageUrl}
            alt={products[0].name}
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            {products[0].badge && (
              <span className="px-3 py-1 bg-blue-600 text-sm font-semibold rounded-full mb-3 inline-block">
                {products[0].badge}
              </span>
            )}
            <h3 className="text-2xl font-bold">{products[0].name}</h3>
            <p className="text-xl mt-2">{products[0].price}</p>
            <button className="mt-4 px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Shop Now
            </button>
          </div>
        </div>
      ) : (
        <div className={cn(
          'grid gap-6',
          columns === 2 && 'sm:grid-cols-2',
          columns === 3 && 'sm:grid-cols-2 lg:grid-cols-3',
          columns === 4 && 'sm:grid-cols-2 lg:grid-cols-4'
        )}>
          {products.map((product, i) => (
            <div key={i} className="group relative bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded">
                    {product.badge}
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-bold text-gray-900">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// ACCORDION COMPONENT (Enhanced)
// ============================================
export interface AccordionProps {
  variant: 'simple' | 'bordered' | 'separated' | 'flush';
  items: Array<{
    title: string;
    content: string;
  }>;
  allowMultiple?: boolean;
  defaultOpen?: number[];
  iconPosition?: 'left' | 'right';
  backgroundColor?: string;
}

export const ACCORDION_PRESETS: Record<string, Partial<AccordionProps>> = {
  'simple': {
    variant: 'simple',
    items: [
      { title: 'What is your refund policy?', content: 'We offer a 30-day money-back guarantee on all purchases. No questions asked.' },
      { title: 'How do I contact support?', content: 'You can reach our support team via email at support@example.com or through our live chat.' },
      { title: 'Do you offer discounts?', content: 'Yes! We offer discounts for annual subscriptions and bulk purchases.' },
    ],
    allowMultiple: false,
    iconPosition: 'right',
    backgroundColor: '#ffffff',
  },
  'bordered': {
    variant: 'bordered',
    items: [
      { title: 'Getting Started', content: 'Learn how to set up your account and start using our platform.' },
      { title: 'Advanced Features', content: 'Discover powerful features to take your work to the next level.' },
      { title: 'Troubleshooting', content: 'Find solutions to common issues and problems.' },
    ],
    allowMultiple: true,
    iconPosition: 'right',
    backgroundColor: '#f9fafb',
  },
  'faq': {
    variant: 'separated',
    items: [
      { title: 'Is there a free trial?', content: 'Yes, we offer a 14-day free trial with full access to all features.' },
      { title: 'Can I cancel anytime?', content: 'Absolutely. You can cancel your subscription at any time with no penalties.' },
      { title: 'What payment methods do you accept?', content: 'We accept all major credit cards, PayPal, and bank transfers.' },
    ],
    allowMultiple: false,
    iconPosition: 'left',
    backgroundColor: '#ffffff',
  },
};

export function AccordionElement({
  variant = 'simple',
  items = [],
  allowMultiple = false,
  defaultOpen = [],
  iconPosition = 'right',
  backgroundColor = '#ffffff',
}: AccordionProps) {
  const [openItems, setOpenItems] = React.useState<number[]>(defaultOpen);

  const toggleItem = (index: number) => {
    if (allowMultiple) {
      setOpenItems(prev =>
        prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
      );
    } else {
      setOpenItems(prev => prev.includes(index) ? [] : [index]);
    }
  };

  const isBordered = variant === 'bordered';
  const isSeparated = variant === 'separated';

  return (
    <div className={cn(
      'w-full',
      isBordered && 'border border-gray-200 rounded-xl overflow-hidden',
      isSeparated && 'space-y-4'
    )} style={{ backgroundColor }}>
      {items.map((item, i) => {
        const isOpen = openItems.includes(i);
        return (
          <div
            key={i}
            className={cn(
              isSeparated && 'border border-gray-200 rounded-lg overflow-hidden',
              isBordered && i > 0 && 'border-t border-gray-200'
            )}
          >
            <button
              onClick={() => toggleItem(i)}
              className={cn(
                'w-full px-6 py-4 flex items-center gap-4 text-left hover:bg-gray-50 transition-colors',
                iconPosition === 'left' && 'flex-row-reverse justify-end'
              )}
            >
              <span className="flex-1 font-medium text-gray-900">{item.title}</span>
              <ChevronDown
                className={cn(
                  'w-5 h-5 text-gray-500 transition-transform',
                  isOpen && 'rotate-180'
                )}
              />
            </button>
            {isOpen && (
              <div className="px-6 pb-4 text-gray-600">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
