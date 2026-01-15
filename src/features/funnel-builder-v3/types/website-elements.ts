import { CSSProperties } from "react";
import { CheckoutAppearance } from "./checkout-elements";

/**
 * Website Element Types for Funnel Builder
 * Includes Hero, Navbar, Footer, Features, Testimonials, etc.
 */

export type WebsiteElementKind =
  // Navigation
  | "navbar"
  | "navbar.logo"
  | "navbar.menu"
  | "navbar.cta"
  
  // Hero Sections
  | "hero"
  | "hero.centered"
  | "hero.split"
  | "hero.fullwidth"
  
  // Features
  | "feature-grid"
  | "feature-card"
  | "feature-list"
  
  // Testimonials
  | "testimonial"
  | "testimonial-slider"
  | "testimonial-grid"
  
  // Footer
  | "footer"
  | "footer.links"
  | "footer.social"
  | "footer.newsletter"
  
  // Pricing
  | "pricing-table"
  | "pricing-card"
  
  // CTA
  | "cta-section"
  | "cta-banner";

// ==================== NAVBAR ====================

export interface NavbarMenuItem {
  label: string;
  link: string;
  type: "link" | "dropdown";
  children?: Array<{ label: string; link: string }>;
}

export interface NavbarProps {
  logo?: {
    type: "text" | "image";
    content: string;
    link?: string;
    height?: number;
  };
  menuItems: NavbarMenuItem[];
  ctaButton?: {
    text: string;
    link: string;
    style: "primary" | "secondary" | "outline";
  };
  layout: "left-aligned" | "centered" | "split";
  sticky?: boolean;
  transparent?: boolean;
  showOnScroll?: boolean;
  appearance?: CheckoutAppearance;
}

// ==================== HERO ====================

export interface HeroButton {
  text: string;
  link: string;
  style: "primary" | "secondary" | "outline";
  icon?: string;
}

export interface HeroProps {
  layout: "centered" | "left-aligned" | "split" | "full-width";
  headline: string;
  subheadline?: string;
  description?: string;
  buttons: HeroButton[];
  image?: {
    src: string;
    alt: string;
    position: "right" | "left" | "background";
    overlay?: boolean;
  };
  backgroundVideo?: {
    src: string;
    poster?: string;
    overlay?: boolean;
  };
  badge?: {
    text: string;
    icon?: string;
  };
  appearance?: CheckoutAppearance;
}

// ==================== FEATURES ====================

export interface Feature {
  id: string;
  icon?: string;
  title: string;
  description: string;
  link?: string;
}

export interface FeatureGridProps {
  title?: string;
  subtitle?: string;
  features: Feature[];
  columns: 2 | 3 | 4;
  iconStyle: "outline" | "solid" | "gradient";
  appearance?: CheckoutAppearance;
}

export interface FeatureCardProps {
  feature: Feature;
  iconStyle: "outline" | "solid" | "gradient";
  appearance?: CheckoutAppearance;
}

export interface FeatureListProps {
  title?: string;
  features: Feature[];
  layout: "vertical" | "horizontal";
  showIcons?: boolean;
  appearance?: CheckoutAppearance;
}

// ==================== TESTIMONIALS ====================

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  company?: string;
  avatar?: string;
  content: string;
  rating?: number;
}

export interface TestimonialProps {
  testimonial: Testimonial;
  showAvatar?: boolean;
  showRating?: boolean;
  appearance?: CheckoutAppearance;
}

export interface TestimonialSliderProps {
  testimonials: Testimonial[];
  autoplay?: boolean;
  interval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  appearance?: CheckoutAppearance;
}

export interface TestimonialGridProps {
  title?: string;
  subtitle?: string;
  testimonials: Testimonial[];
  columns: 2 | 3;
  appearance?: CheckoutAppearance;
}

// ==================== FOOTER ====================

export interface FooterLink {
  label: string;
  link: string;
}

export interface FooterLinkSection {
  title: string;
  links: FooterLink[];
}

export interface FooterSocialLink {
  platform: "facebook" | "twitter" | "instagram" | "linkedin" | "youtube" | "tiktok";
  url: string;
}

export interface FooterProps {
  logo?: {
    type: "text" | "image";
    content: string;
  };
  tagline?: string;
  linkSections: FooterLinkSection[];
  socialLinks?: FooterSocialLink[];
  newsletter?: {
    enabled: boolean;
    title?: string;
    placeholder?: string;
    buttonText?: string;
  };
  copyright?: string;
  layout: "simple" | "multi-column" | "centered";
  appearance?: CheckoutAppearance;
}

// ==================== PRICING ====================

export interface PricingFeature {
  text: string;
  included: boolean;
}

export interface PricingCardProps {
  title: string;
  description?: string;
  price: number;
  currency?: string;
  interval?: "month" | "year" | "one-time";
  features: PricingFeature[];
  ctaText: string;
  ctaLink: string;
  highlighted?: boolean;
  badge?: string;
  appearance?: CheckoutAppearance;
}

export interface PricingTableProps {
  title?: string;
  subtitle?: string;
  cards: PricingCardProps[];
  columns: 2 | 3 | 4;
  showToggle?: boolean;
  appearance?: CheckoutAppearance;
}

// ==================== CTA ====================

export interface CTASectionProps {
  headline: string;
  description?: string;
  buttons: HeroButton[];
  layout: "centered" | "split";
  backgroundImage?: string;
  backgroundVideo?: string;
  appearance?: CheckoutAppearance;
}

export interface CTABannerProps {
  text: string;
  buttonText: string;
  buttonLink: string;
  dismissible?: boolean;
  position: "top" | "bottom";
  appearance?: CheckoutAppearance;
}
