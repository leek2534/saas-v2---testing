import { cn } from '@/lib/utils';
import { Check, X, Minus } from 'lucide-react';

export interface ComparisonTableProps {
  type?: 'before-after' | 'us-vs-them' | 'features';
  leftTitle?: string;
  rightTitle?: string;
  leftSubtitle?: string;
  rightSubtitle?: string;
  items?: Array<{
    label: string;
    left: 'yes' | 'no' | 'partial' | string;
    right: 'yes' | 'no' | 'partial' | string;
  }>;
  leftColor?: string;
  rightColor?: string;
  leftBgColor?: string;
  rightBgColor?: string;
  highlightRight?: boolean;
  showIcons?: boolean;
  borderRadius?: number;
}

const DEFAULT_ITEMS = [
  { label: 'Feature One', left: 'no', right: 'yes' },
  { label: 'Feature Two', left: 'partial', right: 'yes' },
  { label: 'Feature Three', left: 'no', right: 'yes' },
  { label: 'Feature Four', left: 'yes', right: 'yes' },
  { label: 'Feature Five', left: 'no', right: 'yes' },
];

export function ComparisonTableElement({
  type = 'us-vs-them',
  leftTitle = 'Others',
  rightTitle = 'Us',
  leftSubtitle,
  rightSubtitle,
  items = DEFAULT_ITEMS,
  leftColor = '#ef4444',
  rightColor = '#10b981',
  leftBgColor = '#fef2f2',
  rightBgColor = '#ecfdf5',
  highlightRight = true,
  showIcons = true,
  borderRadius = 12,
}: ComparisonTableProps) {

  const renderValue = (value: string, isRight: boolean) => {
    const color = isRight ? rightColor : leftColor;
    
    if (!showIcons) {
      return <span style={{ color }}>{value}</span>;
    }

    if (value === 'yes') {
      return (
        <div className="flex items-center justify-center">
          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
            <Check className="w-4 h-4" style={{ color }} />
          </div>
        </div>
      );
    }
    
    if (value === 'no') {
      return (
        <div className="flex items-center justify-center">
          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
            <X className="w-4 h-4" style={{ color }} />
          </div>
        </div>
      );
    }
    
    if (value === 'partial') {
      return (
        <div className="flex items-center justify-center">
          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-amber-100">
            <Minus className="w-4 h-4 text-amber-600" />
          </div>
        </div>
      );
    }

    return <span className="text-sm" style={{ color }}>{value}</span>;
  };

  if (type === 'before-after') {
    return (
      <div className="overflow-hidden border" style={{ borderRadius }}>
        <div className="grid grid-cols-2">
          <div className="p-4 text-center border-r" style={{ backgroundColor: leftBgColor }}>
            <div className="font-bold text-lg" style={{ color: leftColor }}>{leftTitle || 'Before'}</div>
            {leftSubtitle && <div className="text-sm text-muted-foreground">{leftSubtitle}</div>}
          </div>
          <div className="p-4 text-center" style={{ backgroundColor: rightBgColor }}>
            <div className="font-bold text-lg" style={{ color: rightColor }}>{rightTitle || 'After'}</div>
            {rightSubtitle && <div className="text-sm text-muted-foreground">{rightSubtitle}</div>}
          </div>
        </div>
        {items.map((item, idx) => (
          <div key={idx} className="grid grid-cols-2 border-t">
            <div className="p-3 text-center border-r text-sm">{item.left}</div>
            <div className="p-3 text-center text-sm font-medium" style={{ color: rightColor }}>{item.right}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-hidden border" style={{ borderRadius }}>
      {/* Header */}
      <div className="grid grid-cols-[1fr,100px,100px]">
        <div className="p-4 bg-muted/50" />
        <div className="p-4 text-center border-l" style={{ backgroundColor: leftBgColor }}>
          <div className="font-bold" style={{ color: leftColor }}>{leftTitle}</div>
          {leftSubtitle && <div className="text-xs text-muted-foreground">{leftSubtitle}</div>}
        </div>
        <div 
          className="p-4 text-center border-l"
          style={{ backgroundColor: rightBgColor, boxShadow: highlightRight ? `inset 0 0 0 2px ${rightColor}` : undefined }}
        >
          <div className="font-bold" style={{ color: rightColor }}>{rightTitle}</div>
          {rightSubtitle && <div className="text-xs text-muted-foreground">{rightSubtitle}</div>}
        </div>
      </div>

      {/* Rows */}
      {items.map((item, idx) => (
        <div key={idx} className="grid grid-cols-[1fr,100px,100px] border-t">
          <div className="p-3 text-sm font-medium">{item.label}</div>
          <div className="p-3 border-l" style={{ backgroundColor: `${leftBgColor}50` }}>
            {renderValue(item.left, false)}
          </div>
          <div 
            className="p-3 border-l"
            style={{ backgroundColor: `${rightBgColor}50`, boxShadow: highlightRight ? `inset 0 0 0 2px ${rightColor}` : undefined }}
          >
            {renderValue(item.right, true)}
          </div>
        </div>
      ))}
    </div>
  );
}
