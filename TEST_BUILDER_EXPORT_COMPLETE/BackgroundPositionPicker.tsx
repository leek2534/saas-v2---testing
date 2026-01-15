"use client";



// React import removed - not needed
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

interface BackgroundPositionPickerProps {
  value?: string;
  onChange: (position: string) => void;
  label?: string;
}

const positions = [
  { value: 'top left', label: 'Top Left', icon: '↖' },
  { value: 'top center', label: 'Top Center', icon: '↑' },
  { value: 'top right', label: 'Top Right', icon: '↗' },
  { value: 'center left', label: 'Center Left', icon: '←' },
  { value: 'center', label: 'Center', icon: '●' },
  { value: 'center right', label: 'Center Right', icon: '→' },
  { value: 'bottom left', label: 'Bottom Left', icon: '↙' },
  { value: 'bottom center', label: 'Bottom Center', icon: '↓' },
  { value: 'bottom right', label: 'Bottom Right', icon: '↘' },
];

export function BackgroundPositionPicker({ value, onChange, label }: BackgroundPositionPickerProps) {
  const currentValue = value || 'center';

  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-xs text-gray-600 dark:text-gray-400">{label}</Label>
      )}
      <div className="grid grid-cols-3 gap-2">
        {positions.map((pos) => {
          const isSelected = currentValue === pos.value;
          
          return (
            <button
              key={pos.value}
              type="button"
              onClick={() => onChange(pos.value)}
              className={cn(
                'relative h-16 rounded-lg border-2 transition-all duration-200',
                'flex flex-col items-center justify-center gap-1',
                'hover:scale-105 active:scale-95',
                isSelected
                  ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-md dark:bg-blue-900/30 dark:border-blue-400 dark:text-blue-300'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50/50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:border-blue-600'
              )}
              title={pos.label}
            >
              {/* Visual Grid Indicator */}
              <div className="absolute inset-0 p-2">
                <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-0.5">
                  {Array.from({ length: 9 }).map((_, idx) => {
                    const row = Math.floor(idx / 3);
                    const col = idx % 3;
                    const isActiveCell = 
                      (pos.value.includes('top') && row === 0) ||
                      (pos.value.includes('center') && !pos.value.includes('left') && !pos.value.includes('right') && row === 1) ||
                      (pos.value.includes('bottom') && row === 2);
                    
                    const isActiveCellCol =
                      (pos.value.includes('left') && col === 0) ||
                      (pos.value === 'center' && col === 1) ||
                      (pos.value.includes('center') && !pos.value.includes('left') && !pos.value.includes('right') && col === 1) ||
                      (pos.value.includes('right') && col === 2);

                    const shouldHighlight = isActiveCell && isActiveCellCol;

                    return (
                      <div
                        key={idx}
                        className={cn(
                          'rounded-sm transition-colors',
                          shouldHighlight
                            ? isSelected
                              ? 'bg-blue-500 dark:bg-blue-400'
                              : 'bg-gray-400 dark:bg-gray-500'
                            : 'bg-gray-200 dark:bg-gray-700'
                        )}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Icon */}
              <span className={cn(
                'text-2xl font-bold relative z-10',
                isSelected ? 'text-blue-600 dark:text-blue-300' : 'text-gray-400'
              )}>
                {pos.icon}
              </span>

              {/* Label */}
              <span className="text-[10px] font-medium relative z-10 leading-tight text-center px-1">
                {pos.label.split(' ').map((word, i) => (
                  <span key={i} className="block">{word}</span>
                ))}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
