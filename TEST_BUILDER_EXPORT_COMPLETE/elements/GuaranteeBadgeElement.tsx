/**
 * GuaranteeBadgeElement - Professional guarantee badge designs
 * Based on public domain / CC0 licensed design patterns
 */

import { cn } from '@/lib/utils';

export interface GuaranteeBadgeProps {
  variant?: 'gold-seal' | 'green-shield' | 'blue-ribbon' | 'red-badge' | 'premium-gold' | 'trust-badge';
  days?: number;
  title?: string;
  subtitle?: string;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showDays?: boolean;
  customText?: string;
}

const SIZES = {
  sm: { width: 120 },
  md: { width: 160 },
  lg: { width: 200 },
  xl: { width: 260 },
};

export function GuaranteeBadgeElement({
  variant = 'gold-seal',
  days = 30,
  title = 'Money Back',
  subtitle = 'Guarantee',
  primaryColor,
  secondaryColor,
  textColor = '#ffffff',
  size = 'md',
  showDays = true,
}: GuaranteeBadgeProps) {
  const sizeConfig = SIZES[size];

  // Gold Seal
  if (variant === 'gold-seal') {
    const gold1 = primaryColor || '#D4AF37';
    const gold2 = secondaryColor || '#B8860B';
    return (
      <div className="inline-flex items-center justify-center" style={{ width: sizeConfig.width, height: sizeConfig.width }}>
        <svg viewBox="0 0 200 200" className="w-full h-full" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}>
          <defs>
            <linearGradient id="goldSealGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF8DC" />
              <stop offset="25%" stopColor={gold1} />
              <stop offset="50%" stopColor="#FFD700" />
              <stop offset="75%" stopColor={gold2} />
              <stop offset="100%" stopColor={gold1} />
            </linearGradient>
            <linearGradient id="goldSealGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={gold1} />
              <stop offset="100%" stopColor={gold2} />
            </linearGradient>
          </defs>
          <path d="M100,8 L108,40 L140,20 L125,55 L160,50 L138,80 L175,90 L140,105 L165,135 L125,125 L130,160 L100,140 L70,160 L75,125 L35,135 L60,105 L25,90 L62,80 L40,50 L75,55 L60,20 L92,40 Z" fill="url(#goldSealGrad1)" />
          <circle cx="100" cy="100" r="58" fill="url(#goldSealGrad2)" stroke="#8B7500" strokeWidth="3" />
          <circle cx="100" cy="100" r="50" fill="none" stroke="#FFF8DC" strokeWidth="2" opacity="0.6" />
          {showDays && <text x="100" y="92" textAnchor="middle" fill="#1a1a1a" fontSize="30" fontWeight="900" fontFamily="Georgia, serif">{days}</text>}
          <text x="100" y={showDays ? "110" : "95"} textAnchor="middle" fill="#1a1a1a" fontSize="11" fontWeight="700" fontFamily="Arial, sans-serif" letterSpacing="1">DAY</text>
          <text x="100" y={showDays ? "124" : "112"} textAnchor="middle" fill="#1a1a1a" fontSize="10" fontWeight="600" fontFamily="Arial, sans-serif" letterSpacing="1">{title.toUpperCase()}</text>
          <text x="100" y={showDays ? "137" : "127"} textAnchor="middle" fill="#333" fontSize="9" fontWeight="500" fontFamily="Arial, sans-serif">{subtitle.toUpperCase()}</text>
        </svg>
      </div>
    );
  }

  // Green Shield
  if (variant === 'green-shield') {
    const green1 = primaryColor || '#22c55e';
    const green2 = secondaryColor || '#16a34a';
    return (
      <div className="inline-flex items-center justify-center" style={{ width: sizeConfig.width, height: sizeConfig.width * 1.1 }}>
        <svg viewBox="0 0 180 200" className="w-full h-full" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.25))' }}>
          <defs>
            <linearGradient id="greenShieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={green1} />
              <stop offset="100%" stopColor={green2} />
            </linearGradient>
          </defs>
          <path d="M90,10 L165,35 L165,95 C165,145 125,180 90,195 C55,180 15,145 15,95 L15,35 Z" fill="url(#greenShieldGrad)" stroke={green2} strokeWidth="4" />
          <path d="M90,22 L152,44 L152,93 C152,137 117,168 90,181 C63,168 28,137 28,93 L28,44 Z" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
          <path d="M55,95 L78,118 L125,71" fill="none" stroke={textColor} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          {showDays && <text x="90" y="155" textAnchor="middle" fill={textColor} fontSize="16" fontWeight="800" fontFamily="Arial, sans-serif">{days}-DAY</text>}
          <text x="90" y={showDays ? "172" : "160"} textAnchor="middle" fill={textColor} fontSize="11" fontWeight="600" fontFamily="Arial, sans-serif" letterSpacing="1">{subtitle.toUpperCase()}</text>
        </svg>
      </div>
    );
  }

  // Blue Ribbon
  if (variant === 'blue-ribbon') {
    const blue1 = primaryColor || '#3b82f6';
    const blue2 = secondaryColor || '#1d4ed8';
    return (
      <div className="inline-flex items-center justify-center" style={{ width: sizeConfig.width * 1.5 }}>
        <svg viewBox="0 0 300 120" className="w-full" style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.2))' }}>
          <defs>
            <linearGradient id="blueRibbonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={blue1} />
              <stop offset="100%" stopColor={blue2} />
            </linearGradient>
          </defs>
          <path d="M0,25 L40,25 L40,95 L20,80 L0,95 Z" fill={blue2} />
          <path d="M300,25 L260,25 L260,95 L280,80 L300,95 Z" fill={blue2} />
          <rect x="25" y="15" width="250" height="70" rx="4" fill="url(#blueRibbonGrad)" />
          <path d="M25,15 L40,25 L40,85 L25,85 Z" fill={blue2} opacity="0.6" />
          <path d="M275,15 L260,25 L260,85 L275,85 Z" fill={blue2} opacity="0.6" />
          <rect x="35" y="22" width="230" height="56" rx="2" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
          {showDays && <text x="150" y="48" textAnchor="middle" fill={textColor} fontSize="22" fontWeight="900" fontFamily="Arial Black, sans-serif">{days} DAY</text>}
          <text x="150" y={showDays ? "68" : "52"} textAnchor="middle" fill={textColor} fontSize="14" fontWeight="700" fontFamily="Arial, sans-serif" letterSpacing="2">{title.toUpperCase()}</text>
          {!showDays && <text x="150" y="72" textAnchor="middle" fill={textColor} fontSize="11" fontWeight="500" fontFamily="Arial, sans-serif">{subtitle.toUpperCase()}</text>}
        </svg>
      </div>
    );
  }

  // Red Badge
  if (variant === 'red-badge') {
    const red1 = primaryColor || '#ef4444';
    const red2 = secondaryColor || '#dc2626';
    const points = 20;
    const outerR = 95;
    const innerR = 75;
    let starPath = '';
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = (Math.PI * i) / points - Math.PI / 2;
      const x = 100 + r * Math.cos(angle);
      const y = 100 + r * Math.sin(angle);
      starPath += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1);
    }
    starPath += 'Z';

    return (
      <div className="inline-flex items-center justify-center" style={{ width: sizeConfig.width, height: sizeConfig.width }}>
        <svg viewBox="0 0 200 200" className="w-full h-full" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.25))' }}>
          <defs>
            <linearGradient id="redBadgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={red1} />
              <stop offset="100%" stopColor={red2} />
            </linearGradient>
          </defs>
          <path d={starPath} fill="url(#redBadgeGrad)" />
          <circle cx="100" cy="100" r="55" fill={red2} />
          <circle cx="100" cy="100" r="48" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeDasharray="6 3" />
          {showDays && <text x="100" y="95" textAnchor="middle" fill={textColor} fontSize="28" fontWeight="900" fontFamily="Arial Black, sans-serif">{days}</text>}
          <text x="100" y={showDays ? "115" : "100"} textAnchor="middle" fill={textColor} fontSize="10" fontWeight="700" fontFamily="Arial, sans-serif" letterSpacing="1">DAY {subtitle.toUpperCase()}</text>
        </svg>
      </div>
    );
  }

  // Premium Gold
  if (variant === 'premium-gold') {
    const gold1 = primaryColor || '#D4AF37';
    const gold2 = secondaryColor || '#996515';
    return (
      <div className="inline-flex items-center justify-center" style={{ width: sizeConfig.width, height: sizeConfig.width * 1.15 }}>
        <svg viewBox="0 0 200 230" className="w-full h-full" style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.3))' }}>
          <defs>
            <linearGradient id="premiumGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF8DC" />
              <stop offset="30%" stopColor={gold1} />
              <stop offset="70%" stopColor="#FFD700" />
              <stop offset="100%" stopColor={gold2} />
            </linearGradient>
          </defs>
          <path d="M60,160 L60,220 L80,200 L100,220 L100,160" fill={gold2} />
          <path d="M100,160 L100,220 L120,200 L140,220 L140,160" fill={gold1} />
          <circle cx="100" cy="100" r="95" fill="none" stroke={gold1} strokeWidth="3" />
          <circle cx="100" cy="100" r="88" fill="none" stroke={gold2} strokeWidth="1" strokeDasharray="10 5" />
          <circle cx="100" cy="100" r="80" fill="url(#premiumGoldGrad)" stroke={gold2} strokeWidth="3" />
          <circle cx="100" cy="100" r="68" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
          {showDays && <text x="100" y="90" textAnchor="middle" fill="#1a1a1a" fontSize="34" fontWeight="900" fontFamily="Georgia, serif">{days}</text>}
          <text x="100" y={showDays ? "110" : "92"} textAnchor="middle" fill="#1a1a1a" fontSize="12" fontWeight="700" fontFamily="Georgia, serif" letterSpacing="2">DAY</text>
          <text x="100" y={showDays ? "126" : "110"} textAnchor="middle" fill="#333" fontSize="11" fontWeight="600" fontFamily="Georgia, serif" letterSpacing="1">{title.toUpperCase()}</text>
          <text x="100" y={showDays ? "140" : "126"} textAnchor="middle" fill="#444" fontSize="10" fontWeight="500" fontFamily="Georgia, serif">{subtitle.toUpperCase()}</text>
        </svg>
      </div>
    );
  }

  // Trust Badge (default)
  const badgeColor = primaryColor || '#10b981';
  return (
    <div 
      className={cn("inline-flex items-center gap-4 px-6 py-4 rounded-2xl border-2 bg-white")}
      style={{ borderColor: badgeColor, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-full" style={{ backgroundColor: badgeColor }}>
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={textColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      </div>
      <div>
        <div className="font-bold text-lg" style={{ color: badgeColor }}>{showDays ? days + '-Day ' : ''}{title}</div>
        <div className="text-sm text-gray-500">{subtitle}</div>
      </div>
    </div>
  );
}
