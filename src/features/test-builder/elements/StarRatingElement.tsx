import { Star } from 'lucide-react';

export interface StarRatingProps {
  rating?: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  emptyColor?: string;
  showCount?: boolean;
  count?: number;
  countText?: string;
  layout?: 'horizontal' | 'vertical';
  alignment?: 'left' | 'center' | 'right';
}

const SIZES = {
  sm: { star: 'w-4 h-4', text: 'text-xs', gap: 'gap-0.5' },
  md: { star: 'w-5 h-5', text: 'text-sm', gap: 'gap-1' },
  lg: { star: 'w-6 h-6', text: 'text-base', gap: 'gap-1' },
  xl: { star: 'w-8 h-8', text: 'text-lg', gap: 'gap-1.5' },
};

export function StarRatingElement({
  rating = 4.8,
  maxRating = 5,
  size = 'md',
  color = '#facc15',
  emptyColor = '#e5e7eb',
  showCount = true,
  count = 2847,
  countText = 'reviews',
  layout = 'horizontal',
  alignment = 'left',
}: StarRatingProps) {
  const sizeConfig = SIZES[size];
  const fullStars = Math.floor(rating);
  const partialFill = rating - fullStars;
  const emptyStars = maxRating - Math.ceil(rating);

  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  const renderStar = (fill: 'full' | 'partial' | 'empty', index: number) => {
    if (fill === 'full') {
      return (
        <Star
          key={index}
          className={sizeConfig.star}
          fill={color}
          stroke={color}
        />
      );
    }

    if (fill === 'partial') {
      return (
        <div key={index} className="relative">
          <Star className={sizeConfig.star} fill={emptyColor} stroke={emptyColor} />
          <div 
            className="absolute inset-0 overflow-hidden" 
            style={{ width: `${partialFill * 100}%` }}
          >
            <Star className={sizeConfig.star} fill={color} stroke={color} />
          </div>
        </div>
      );
    }

    return (
      <Star
        key={index}
        className={sizeConfig.star}
        fill={emptyColor}
        stroke={emptyColor}
      />
    );
  };

  const starsContent = (
    <div className={`flex items-center ${sizeConfig.gap}`}>
      {Array(fullStars).fill(0).map((_, i) => renderStar('full', i))}
      {partialFill > 0 && renderStar('partial', fullStars)}
      {Array(emptyStars).fill(0).map((_, i) => renderStar('empty', fullStars + 1 + i))}
    </div>
  );

  const ratingText = (
    <div className={`flex items-center gap-2 ${sizeConfig.text}`}>
      <span className="font-bold">{rating.toFixed(1)}</span>
      {showCount && (
        <span className="text-muted-foreground">
          ({count.toLocaleString()} {countText})
        </span>
      )}
    </div>
  );

  if (layout === 'vertical') {
    return (
      <div className={`flex flex-col items-center gap-1 ${alignment === 'left' ? 'items-start' : alignment === 'right' ? 'items-end' : 'items-center'}`}>
        {starsContent}
        {ratingText}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 flex-wrap ${alignmentClasses[alignment]}`}>
      {starsContent}
      {ratingText}
    </div>
  );
}
