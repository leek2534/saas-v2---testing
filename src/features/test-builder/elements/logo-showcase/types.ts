export type LogoItem = {
  id: string;
  src: string;            // primary logo url (color / light)
  darkSrc?: string;       // optional alternate for dark mode
  alt?: string;
  url?: string;           // optional link
  width?: number | null;  // desired rendered width px (null = auto)
  height?: number | null; // desired rendered height px
  caption?: string;       // optional caption under logo
  visible?: boolean;
  grayscale?: boolean;
  opacity?: number;       // 0-1
};

export type CarouselMode = 'ticker' | 'manual';

export type LogoShowcaseSettings = {
  // Carousel/Ticker Mode
  mode: CarouselMode; // 'ticker' = continuous scroll, 'manual' = click-through with dots
  
  // Animation Settings
  animation: {
    speed: number; // 1-10 scale (ticker speed or transition duration)
    direction: 'left' | 'right';
    pauseOnHover: boolean;
  };
  
  // Manual Carousel Settings (only for 'manual' mode)
  manual: {
    showDots: boolean;
    showArrows: boolean;
    logosPerSlide: number; // How many logos visible at once
  };
  
  // Style Settings
  style: {
    background?: string;
    padding: number; // px
    logoSpacing: number; // gap between logos in px
    logoHeight: number; // max height of logos in px
    grayscale: boolean; // Apply grayscale filter to all logos
  };
  
  // Hover Effects
  hover: {
    effect: 'none' | 'grow' | 'lift' | 'brighten';
    pauseAnimation: boolean; // Pause ticker on hover
  };
};

export const defaultLogoShowcaseSettings: LogoShowcaseSettings = {
  mode: 'ticker',
  animation: {
    speed: 5, // Medium speed (1-10 scale)
    direction: 'left',
    pauseOnHover: true
  },
  manual: {
    showDots: true,
    showArrows: true,
    logosPerSlide: 4
  },
  style: {
    background: 'transparent',
    padding: 32,
    logoSpacing: 48,
    logoHeight: 60,
    grayscale: false
  },
  hover: {
    effect: 'grow',
    pauseAnimation: true
  }
};
