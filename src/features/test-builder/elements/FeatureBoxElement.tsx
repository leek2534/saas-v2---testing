import { cn } from '@/lib/utils';
import { Zap, Star, Check, Heart, Shield, Rocket, Target, Award, Lightbulb, Users, Clock, TrendingUp } from 'lucide-react';

export interface FeatureBoxProps {
  icon?: string;
  title?: string;
  description?: string;
  layout?: 'vertical' | 'horizontal' | 'horizontal-reverse';
  iconPosition?: 'top' | 'left' | 'right';
  iconSize?: 'sm' | 'md' | 'lg' | 'xl';
  iconColor?: string;
  iconBackgroundColor?: string;
  iconStyle?: 'filled' | 'outlined' | 'minimal';
  titleColor?: string;
  descriptionColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: number;
  padding?: number;
  alignment?: 'left' | 'center' | 'right';
  showBorder?: boolean;
  showShadow?: boolean;
}

const ICON_SIZES = {
  sm: { container: 'w-10 h-10', icon: 'w-5 h-5' },
  md: { container: 'w-12 h-12', icon: 'w-6 h-6' },
  lg: { container: 'w-16 h-16', icon: 'w-8 h-8' },
  xl: { container: 'w-20 h-20', icon: 'w-10 h-10' },
};

export function FeatureBoxElement({
  icon = 'Zap',
  title = 'Feature Title',
  description = 'Describe your amazing feature here. Keep it short and impactful.',
  layout = 'vertical',
  iconSize = 'md',
  iconColor = '#3b82f6',
  iconBackgroundColor = '#eff6ff',
  iconStyle = 'filled',
  titleColor = '#111827',
  descriptionColor = '#6b7280',
  backgroundColor = 'transparent',
  borderColor = '#e5e7eb',
  borderRadius = 12,
  padding = 24,
  alignment = 'center',
  showBorder = false,
  showShadow = false,
}: FeatureBoxProps) {
  const ICONS: Record<string, typeof Zap> = {
    Zap, Star, Check, Heart, Shield, Rocket, Target, Award, Lightbulb, Users, Clock, TrendingUp
  };
  const IconComponent = ICONS[icon] || Zap;
  const sizeConfig = ICON_SIZES[iconSize];

  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  const renderIcon = () => {
    if (iconStyle === 'minimal') {
      return (
        <div className="mb-4">
          <IconComponent className={sizeConfig.icon} style={{ color: iconColor }} />
        </div>
      );
    }

    if (iconStyle === 'outlined') {
      return (
        <div 
          className={cn(sizeConfig.container, "rounded-xl flex items-center justify-center mb-4 border-2")}
          style={{ borderColor: iconColor }}
        >
          <IconComponent className={sizeConfig.icon} style={{ color: iconColor }} />
        </div>
      );
    }

    return (
      <div 
        className={cn(sizeConfig.container, "rounded-xl flex items-center justify-center mb-4")}
        style={{ backgroundColor: iconBackgroundColor }}
      >
        <IconComponent className={sizeConfig.icon} style={{ color: iconColor }} />
      </div>
    );
  };

  if (layout === 'horizontal' || layout === 'horizontal-reverse') {
    return (
      <div 
        className={cn(
          "flex gap-4",
          layout === 'horizontal-reverse' && "flex-row-reverse",
          showBorder && "border",
          showShadow && "shadow-lg",
        )}
        style={{ 
          backgroundColor, 
          borderColor: showBorder ? borderColor : undefined,
          borderRadius,
          padding,
        }}
      >
        <div className="flex-shrink-0">
          {iconStyle === 'minimal' ? (
            <IconComponent className={sizeConfig.icon} style={{ color: iconColor }} />
          ) : iconStyle === 'outlined' ? (
            <div 
              className={cn(sizeConfig.container, "rounded-xl flex items-center justify-center border-2")}
              style={{ borderColor: iconColor }}
            >
              <IconComponent className={sizeConfig.icon} style={{ color: iconColor }} />
            </div>
          ) : (
            <div 
              className={cn(sizeConfig.container, "rounded-xl flex items-center justify-center")}
              style={{ backgroundColor: iconBackgroundColor }}
            >
              <IconComponent className={sizeConfig.icon} style={{ color: iconColor }} />
            </div>
          )}
        </div>
        <div className={cn("flex-1", alignment === 'right' && "text-right")}>
          <h3 className="font-semibold text-lg mb-1" style={{ color: titleColor }}>
            {title}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: descriptionColor }}>
            {description}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "flex flex-col",
        alignmentClasses[alignment],
        showBorder && "border",
        showShadow && "shadow-lg",
      )}
      style={{ 
        backgroundColor, 
        borderColor: showBorder ? borderColor : undefined,
        borderRadius,
        padding,
      }}
    >
      {renderIcon()}
      <h3 className="font-semibold text-lg mb-2" style={{ color: titleColor }}>
        {title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: descriptionColor }}>
        {description}
      </p>
    </div>
  );
}
