"use client";

import { useRef, useEffect, useState } from 'react';
import { LogoItem, LogoShowcaseSettings, defaultLogoShowcaseSettings } from './types';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  id?: string;
  logos: LogoItem[];
  settings: LogoShowcaseSettings;
  className?: string;
  onClickLogo?: (logo: LogoItem) => void;
  darkMode?: boolean;
};

export function LogoShowcaseElement({
  id,
  logos,
  settings = defaultLogoShowcaseSettings,
  className,
  onClickLogo,
  darkMode = false
}: Props) {
  const merged = { ...defaultLogoShowcaseSettings, ...settings } as LogoShowcaseSettings;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Filter visible logos
  const visibleLogos = logos.filter(l => l.visible !== false);
  
  // Calculate speed in pixels per second (1-10 scale to 10-100 px/s)
  const pixelsPerSecond = merged.animation.speed * 10;
  
  // Ticker mode: Continuous scrolling animation
  useEffect(() => {
    if (merged.mode !== 'ticker') return;
    if (isHovering && merged.animation.pauseOnHover) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    let animationId: number;
    let lastTime = Date.now();
    let scrollPosition = 0;
    
    const animate = () => {
      const now = Date.now();
      const delta = (now - lastTime) / 1000; // seconds
      lastTime = now;
      
      // Calculate scroll distance based on speed and direction
      const distance = pixelsPerSecond * delta;
      scrollPosition += merged.animation.direction === 'left' ? distance : -distance;
      
      // Get total width of content
      const contentWidth = container.scrollWidth / 2; // Divided by 2 because we duplicate content
      
      // Reset position for seamless loop
      if (scrollPosition >= contentWidth) {
        scrollPosition = 0;
      } else if (scrollPosition < 0) {
        scrollPosition = contentWidth;
      }
      
      container.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [merged.mode, merged.animation.speed, merged.animation.direction, merged.animation.pauseOnHover, isHovering, pixelsPerSecond]);
  
  // Manual mode: Calculate slides
  const totalSlides = merged.mode === 'manual' 
    ? Math.ceil(visibleLogos.length / merged.manual.logosPerSlide)
    : 0;
  
  const goToSlide = (index: number) => {
    setCurrentSlide(Math.max(0, Math.min(index, totalSlides - 1)));
  };
  
  const nextSlide = () => goToSlide(currentSlide + 1);
  const prevSlide = () => goToSlide(currentSlide - 1);
  
  // Render individual logo
  const renderLogo = (logo: LogoItem, idx: number, key?: string) => {
    const src = darkMode && logo.darkSrc ? logo.darkSrc : logo.src;
    
    const logoStyle: React.CSSProperties = {
      maxHeight: `${merged.style.logoHeight}px`,
      height: 'auto',
      width: 'auto',
      objectFit: 'contain',
      opacity: logo.opacity ?? 1,
      filter: merged.style.grayscale || logo.grayscale ? 'grayscale(100%)' : undefined,
      display: 'block'
    };
    
    const hoverClass = cn(
      'transition-all duration-300',
      merged.hover.effect === 'grow' && 'hover:scale-110',
      merged.hover.effect === 'lift' && 'hover:-translate-y-2',
      merged.hover.effect === 'brighten' && 'hover:brightness-110'
    );
    
    const handleClick = () => {
      if (onClickLogo) onClickLogo(logo);
      if (logo.url) {
        window.open(logo.url, '_blank', 'noopener,noreferrer');
      }
    };
    
    return (
      <div
        key={key || `${logo.id}-${idx}`}
        className={cn(
          'flex items-center justify-center flex-shrink-0',
          logo.url && 'cursor-pointer',
          hoverClass
        )}
        style={{
          marginRight: `${merged.style.logoSpacing}px`,
          minWidth: 'fit-content'
        }}
        onClick={handleClick}
      >
        <img
          src={src}
          alt={logo.alt || logo.caption || `logo-${idx}`}
          loading="lazy"
          style={logoStyle}
          className="transition-transform"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.src.startsWith('data:')) {
              target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="40"%3E%3Crect fill="%233b82f6"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white"%3ELOGO%3C/text%3E%3C/svg%3E';
            }
          }}
        />
        {logo.caption && (
          <div className="text-xs text-gray-500 mt-1 text-center">
            {logo.caption}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div
      id={id}
      className={cn('w-full relative', className)}
      style={{
        background: merged.style.background,
        padding: `${merged.style.padding}px 0`
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Ticker Mode */}
      {merged.mode === 'ticker' && (
        <div className="overflow-hidden">
          <div
            ref={containerRef}
            className="flex items-center overflow-x-hidden"
            style={{
              scrollBehavior: 'auto',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {/* Render logos twice for seamless loop */}
            {visibleLogos.map((logo, i) => renderLogo(logo, i, `original-${i}`))}
            {visibleLogos.map((logo, i) => renderLogo(logo, i, `duplicate-${i}`))}
          </div>
        </div>
      )}
      
      {/* Manual Carousel Mode */}
      {merged.mode === 'manual' && (
        <div className="relative">
          {/* Carousel Container */}
          <div className="overflow-hidden">
            <div
              className="flex items-center transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`
              }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div
                  key={slideIndex}
                  className="flex items-center flex-shrink-0"
                  style={{ width: '100%' }}
                >
                  <div className="flex items-center justify-center w-full">
                    {visibleLogos
                      .slice(
                        slideIndex * merged.manual.logosPerSlide,
                        (slideIndex + 1) * merged.manual.logosPerSlide
                      )
                      .map((logo, i) => renderLogo(logo, slideIndex * merged.manual.logosPerSlide + i))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Arrows */}
          {merged.manual.showArrows && totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className={cn(
                  'absolute left-2 top-1/2 -translate-y-1/2 z-10',
                  'w-10 h-10 rounded-full bg-white/90 shadow-lg',
                  'flex items-center justify-center',
                  'hover:bg-white transition-all',
                  'disabled:opacity-30 disabled:cursor-not-allowed'
                )}
                aria-label="Previous slide"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextSlide}
                disabled={currentSlide === totalSlides - 1}
                className={cn(
                  'absolute right-2 top-1/2 -translate-y-1/2 z-10',
                  'w-10 h-10 rounded-full bg-white/90 shadow-lg',
                  'flex items-center justify-center',
                  'hover:bg-white transition-all',
                  'disabled:opacity-30 disabled:cursor-not-allowed'
                )}
                aria-label="Next slide"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
          
          {/* Pagination Dots */}
          {merged.manual.showDots && totalSlides > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all',
                    currentSlide === i
                      ? 'bg-primary w-6'
                      : 'bg-gray-300 hover:bg-gray-400'
                  )}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
