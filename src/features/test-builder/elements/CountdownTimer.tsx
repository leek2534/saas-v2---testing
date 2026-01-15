"use client";



import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import './countdown-flip.css';

interface CountdownTimerProps {
  targetDate?: string;
  countdownType?: 'fixed' | 'evergreen' | 'recurring';
  evergreenDays?: number;
  evergreenHours?: number;
  recurringTime?: string;
  displayFormat?: 'full' | 'hours' | 'minutes' | 'compact';
  visualStyle?: 'minimal' | 'boxed' | 'digital' | 'flip' | 'circular';
  title?: string;
  daysLabel?: string;
  hoursLabel?: string;
  minutesLabel?: string;
  secondsLabel?: string;
  numberColor?: string;
  labelColor?: string;
  titleColor?: string;
  backgroundColor?: string;
  fontSize?: number;
  labelFontSize?: number;
  titleFontSize?: number;
  fontWeight?: string;
  textDecoration?: string;
  textTransform?: string;
  letterSpacing?: string;
  lineHeight?: string;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  borderRadius?: number;
  gap?: number;
  alignment?: string;
  showSeparator?: boolean;
  animateNumbers?: boolean;
  pulseOnLowTime?: boolean;
  lowTimeThreshold?: number;
  expiredMessage?: string;
  hideOnExpire?: boolean;
  glowEffect?: boolean;
  digitShape?: 'rectangular' | 'rounded' | 'pill';
  showProgress?: boolean;
  onUpdate?: (updates: Partial<CountdownTimerProps>) => void;
  editable?: boolean;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

// Inline Editable Number Component with increment/decrement
function EditableNumber({ 
  value, 
  onSave, 
  style, 
  className,
  editable = false,
  min = 0,
  max = 99
}: { 
  value: number; 
  onSave: (newValue: number) => void; 
  style?: React.CSSProperties; 
  className?: string;
  editable?: boolean;
  min?: number;
  max?: number;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(value).padStart(2, '0'));
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    if (editable) {
      setIsEditing(true);
      setEditValue(String(value).padStart(2, '0'));
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editable) {
      const newValue = Math.min(max, value + 1);
      onSave(newValue);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editable) {
      const newValue = Math.max(min, value - 1);
      onSave(newValue);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    const numValue = parseInt(editValue) || 0;
    const clampedValue = Math.max(min, Math.min(max, numValue));
    if (clampedValue !== value) {
      console.log('🔢 EditableNumber: Saving new value:', { old: value, new: clampedValue });
      onSave(clampedValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(String(value).padStart(2, '0'));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleIncrement(e as any);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleDecrement(e as any);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value.replace(/\D/g, '').slice(0, 2))}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        style={{
          ...style,
          border: '2px solid #3b82f6',
          outline: 'none',
          background: 'rgba(59, 130, 246, 0.1)',
          padding: '2px 4px',
          borderRadius: '4px',
          textAlign: 'center',
          width: '3em',
          display: 'inline-block', // Add this line
          minWidth: '2ch', // Add this line
        }}
        className={className}
      />
    );
  }

  return (
    <span
      onDoubleClick={handleDoubleClick}
      style={{
        ...style,
        cursor: editable ? 'text' : 'default',
        userSelect: editable ? 'none' : 'auto',
        position: 'relative',
        display: 'inline-block',
        minWidth: '2ch',
      }}
      className={className}
      title={editable ? 'Double-click to edit, or use arrow keys' : ''}
    >
      {String(value).padStart(2, '0')}
      {editable && (
        <div 
          className="absolute -right-6 top-1/2 -translate-y-1/2 flex flex-col opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto"
          style={{ fontSize: '10px', zIndex: 10 }}
        >
          <button
            onClick={handleIncrement}
            className="px-1 py-0.5 hover:bg-blue-100 rounded text-blue-600 bg-white shadow-sm border border-gray-200"
            title="Increment"
          >
            ▲
          </button>
          <button
            onClick={handleDecrement}
            className="px-1 py-0.5 hover:bg-blue-100 rounded text-blue-600 bg-white shadow-sm border border-gray-200"
            title="Decrement"
          >
            ▼
          </button>
        </div>
      )}
    </span>
  );
}

// Inline Editable Text Component
function EditableText({ 
  value, 
  onSave, 
  style, 
  className,
  editable = false 
}: { 
  value: string; 
  onSave: (newValue: string) => void; 
  style?: React.CSSProperties; 
  className?: string;
  editable?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    if (editable) {
      setIsEditing(true);
      setEditValue(value);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editValue !== value) {
      console.log('📝 EditableText: Saving new value:', { old: value, new: editValue });
      onSave(editValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(value);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        style={{
          ...style,
          border: '2px solid #3b82f6',
          outline: 'none',
          background: 'rgba(59, 130, 246, 0.1)',
          padding: '2px 4px',
          borderRadius: '4px',
        }}
        className={className}
      />
    );
  }

  return (
    <span
      onDoubleClick={handleDoubleClick}
      style={{
        ...style,
        cursor: editable ? 'text' : 'default',
        userSelect: editable ? 'none' : 'auto',
      }}
      className={className}
      title={editable ? 'Double-click to edit' : ''}
    >
      {value}
    </span>
  );
}

export function CountdownTimer(props: CountdownTimerProps) {
  const calculateTimeRemaining = (): TimeRemaining => {
    if (props.countdownType === 'fixed' && props.targetDate) {
      const end = new Date(props.targetDate).getTime();
      const now = Date.now();
      const diff = Math.max(0, end - now);
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      return { days, hours, minutes, seconds, total: diff };
    } else if (props.countdownType === 'evergreen') {
      const storageKey = `countdown_evergreen_${props.evergreenDays}_${props.evergreenHours}`;
      let startTime = localStorage.getItem(storageKey);
      
      if (!startTime) {
        startTime = Date.now().toString();
        localStorage.setItem(storageKey, startTime);
      }
      
      const evergreenMs = ((props.evergreenDays || 0) * 24 * 60 * 60 * 1000) + ((props.evergreenHours || 0) * 60 * 60 * 1000);
      const endTime = parseInt(startTime) + evergreenMs;
      const diff = Math.max(0, endTime - Date.now());
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      return { days, hours, minutes, seconds, total: diff };
    } else if (props.countdownType === 'recurring') {
      const now = new Date();
      const [hours, minutes] = (props.recurringTime || '23:59').split(':').map(Number);
      const target = new Date(now);
      target.setHours(hours, minutes, 0, 0);
      
      if (target.getTime() < now.getTime()) {
        target.setDate(target.getDate() + 1);
      }
      
      const diff = target.getTime() - now.getTime();
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      
      return { days: d, hours: h, minutes: m, seconds: s, total: diff };
    }
    
    const now = Date.now();
    const futureTime = now + (2 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000) + (30 * 60 * 1000) + (45 * 1000);
    const diff = futureTime - now;
    
    return { 
      days: 2, 
      hours: 14, 
      minutes: 30, 
      seconds: 45, 
      total: diff 
    };
  };

  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(calculateTimeRemaining());
  const [isExpired, setIsExpired] = useState(false);
  const [isLowTime, setIsLowTime] = useState(false);
  const [prevValues, setPrevValues] = useState<TimeRemaining>(timeRemaining);
  const [flipKeys, setFlipKeys] = useState<Record<string, number>>({});

  useEffect(() => {
    const remaining = calculateTimeRemaining();
    setTimeRemaining(remaining);
    setPrevValues(remaining);
    
    const timer = setInterval(() => {
      setPrevValues((prev) => {
        const current = calculateTimeRemaining();
        
        if (!prev) {
          setTimeRemaining(current);
          return current;
        }
        
        // Update flip keys for each unit that changed to trigger animation
        const format = props.displayFormat || 'full';
        const keys = format === 'full' ? ['days', 'hours', 'minutes', 'seconds'] :
                     format === 'hours' ? ['hours', 'minutes', 'seconds'] :
                     format === 'minutes' ? ['minutes', 'seconds'] : ['hours', 'minutes', 'seconds'];
        
        setFlipKeys((currentFlipKeys) => {
          const newFlipKeys: Record<string, number> = { ...currentFlipKeys };
          keys.forEach((key) => {
            if (prev[key as keyof TimeRemaining] !== current[key as keyof TimeRemaining]) {
              newFlipKeys[key] = (newFlipKeys[key] || 0) + 1;
            }
          });
          return newFlipKeys;
        });
        
        setTimeRemaining(current);
        
        if (current.total === 0) {
          setIsExpired(true);
        }
        
        if (props.pulseOnLowTime && current.total < (props.lowTimeThreshold || 60) * 1000) {
          setIsLowTime(true);
        } else {
          setIsLowTime(false);
        }
        
        return current;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [props.targetDate, props.countdownType, props.evergreenDays, props.evergreenHours, props.recurringTime, props.pulseOnLowTime, props.lowTimeThreshold, props.displayFormat]);

  if (isExpired && props.hideOnExpire) {
    return null;
  }

  if (isExpired && props.expiredMessage) {
    return (
      <div 
        className="text-center font-semibold"
        style={{
          color: props.numberColor || '#000000',
          fontSize: `${(props.fontSize || 48) * 0.5}px`,
          padding: `${props.paddingTop || 20}px ${props.paddingRight || 20}px ${props.paddingBottom || 20}px ${props.paddingLeft || 20}px`,
        }}
      >
        {props.expiredMessage}
      </div>
    );
  }

  // Get proper default colors based on visual style
  const getDefaultColors = () => {
    const style = props.visualStyle || 'boxed';
    if (style === 'digital') return { number: '#22c55e', label: '#86efac', bg: '#000000' };
    if (style === 'minimal') return { number: '#111827', label: '#6b7280', bg: 'transparent' };
    if (style === 'circular') return { number: '#3b82f6', label: '#6b7280', bg: '#e5e7eb' };
    return { number: '#ffffff', label: '#d1d5db', bg: '#1f2937' }; // boxed/flip default
  };

  const defaultColors = getDefaultColors();
  const numberColor = props.numberColor || defaultColors.number;
  const labelColor = props.labelColor || defaultColors.label;
  const backgroundColor = props.backgroundColor || defaultColors.bg;
  const baseFontSize = props.fontSize || 48;

  const getTimeUnits = () => {
    const format = props.displayFormat || 'full';
    if (format === 'full') return [
      { value: timeRemaining.days, label: props.daysLabel || 'Days' },
      { value: timeRemaining.hours, label: props.hoursLabel || 'Hours' },
      { value: timeRemaining.minutes, label: props.minutesLabel || 'Minutes' },
      { value: timeRemaining.seconds, label: props.secondsLabel || 'Seconds' }
    ];
    if (format === 'hours') return [
      { value: timeRemaining.hours, label: props.hoursLabel || 'Hours' },
      { value: timeRemaining.minutes, label: props.minutesLabel || 'Minutes' },
      { value: timeRemaining.seconds, label: props.secondsLabel || 'Seconds' }
    ];
    if (format === 'minutes') return [
      { value: timeRemaining.minutes, label: props.minutesLabel || 'Minutes' },
      { value: timeRemaining.seconds, label: props.secondsLabel || 'Seconds' }
    ];
    return [
      { value: timeRemaining.hours, label: props.hoursLabel || 'Hours' },
      { value: timeRemaining.minutes, label: props.minutesLabel || 'Minutes' },
      { value: timeRemaining.seconds, label: props.secondsLabel || 'Seconds' }
    ];
  };

  const timeUnits = getTimeUnits();
  const visualStyle = props.visualStyle || 'boxed';
  const isCompact = props.displayFormat === 'compact';

  const getTimeKey = (index: number): keyof TimeRemaining => {
    const format = props.displayFormat || 'full';
    if (format === 'full') {
      return ['days', 'hours', 'minutes', 'seconds'][index] as keyof TimeRemaining;
    } else if (format === 'hours') {
      return ['hours', 'minutes', 'seconds'][index] as keyof TimeRemaining;
    } else if (format === 'minutes') {
      return ['minutes', 'seconds'][index] as keyof TimeRemaining;
    }
    return ['hours', 'minutes', 'seconds'][index] as keyof TimeRemaining;
  };

  // Helper to adjust countdown time
  const handleTimeAdjustment = (timeKey: keyof TimeRemaining, newValue: number) => {
    if (!props.editable || props.countdownType !== 'fixed') return;
    
    const now = Date.now();
    const currentTarget = props.targetDate ? new Date(props.targetDate).getTime() : now + (2 * 24 * 60 * 60 * 1000);
    const diff = currentTarget - now;
    
    // Calculate new target based on which unit was changed
    const msPerDay = 24 * 60 * 60 * 1000;
    const msPerHour = 60 * 60 * 1000;
    const msPerMinute = 60 * 1000;
    const msPerSecond = 1000;
    
    let newDiff = diff;
    const currentDays = Math.floor(diff / msPerDay);
    const currentHours = Math.floor((diff % msPerDay) / msPerHour);
    const currentMinutes = Math.floor((diff % msPerHour) / msPerMinute);
    const currentSeconds = Math.floor((diff % msPerMinute) / msPerSecond);
    
    if (timeKey === 'days') {
      newDiff = (newValue * msPerDay) + (currentHours * msPerHour) + (currentMinutes * msPerMinute) + (currentSeconds * msPerSecond);
    } else if (timeKey === 'hours') {
      newDiff = (currentDays * msPerDay) + (newValue * msPerHour) + (currentMinutes * msPerMinute) + (currentSeconds * msPerSecond);
    } else if (timeKey === 'minutes') {
      newDiff = (currentDays * msPerDay) + (currentHours * msPerHour) + (newValue * msPerMinute) + (currentSeconds * msPerSecond);
    } else if (timeKey === 'seconds') {
      newDiff = (currentDays * msPerDay) + (currentHours * msPerHour) + (currentMinutes * msPerMinute) + (newValue * msPerSecond);
    }
    
    const newTarget = new Date(now + newDiff).toISOString();
    console.log('⏰ Time adjusted:', { timeKey, newValue, newTarget });
    props.onUpdate?.({ targetDate: newTarget });
  };

  const renderMinimal = () => (
    <div className="flex items-center gap-2">
      {timeUnits.map((unit, i) => {
        const timeKey = getTimeKey(i);
        const hasChanged = prevValues && prevValues[timeKey] !== unit.value;
        const maxValue = timeKey === 'days' ? 365 : (timeKey === 'hours' ? 23 : 59);
        
        return (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center group">
            <EditableNumber
              value={unit.value}
              onSave={(newValue) => handleTimeAdjustment(timeKey, newValue)}
              editable={props.editable && props.countdownType === 'fixed'}
              min={0}
              max={maxValue}
              className={cn(
                "font-bold",
                props.animateNumbers && "transition-all duration-300 ease-out",
                hasChanged && props.animateNumbers && "scale-110"
              )}
              style={{
                fontSize: `${baseFontSize}px`,
                color: numberColor,
                fontWeight: props.fontWeight || '700',
              }}
            />
            <EditableText
              value={unit.label}
              onSave={(newLabel) => {
                const labelKey = `${timeKey}Label` as keyof CountdownTimerProps;
                props.onUpdate?.({ [labelKey]: newLabel } as any);
              }}
              editable={props.editable}
              className="text-xs uppercase"
              style={{
                fontSize: `${props.labelFontSize || 14}px`,
                color: labelColor,
              }}
            />
          </div>
          {(props.showSeparator !== false) && i < timeUnits.length - 1 && (
            <span 
              style={{
                fontSize: `${baseFontSize}px`,
                color: numberColor,
                fontWeight: props.fontWeight || '700',
                margin: '0 4px',
              }}
            >
              :
            </span>
          )}
        </React.Fragment>
      )})}
    </div>
  );

  const renderBoxed = () => (
    <div className="flex items-center" style={{ gap: `${props.gap || 16}px` }}>
      {timeUnits.map((unit, i) => {
        const timeKey = getTimeKey(i);
        const hasChanged = prevValues && prevValues[timeKey] !== unit.value;
        return (
        <React.Fragment key={i}>
          <div 
            className={cn(
              "flex flex-col items-center justify-center",
              props.animateNumbers && "transition-all duration-300 ease-out",
              isLowTime && props.pulseOnLowTime && "animate-pulse",
              hasChanged && props.animateNumbers && "scale-105"
            )}
            style={{
              backgroundColor: props.backgroundColor || '#1f2937',
              borderRadius: `${props.borderRadius || 8}px`,
              padding: `${props.paddingTop || 20}px ${props.paddingRight || 20}px ${props.paddingBottom || 20}px ${props.paddingLeft || 20}px`,
              minWidth: `${(props.fontSize || 48) * 1.5}px`,
              boxShadow: hasChanged && props.animateNumbers ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
            }}
          >
            <span 
              className={cn(
                "font-bold",
                props.animateNumbers && "transition-transform duration-200"
              )}
              style={{
                fontSize: `${baseFontSize}px`,
                color: numberColor,
                fontWeight: props.fontWeight || '700',
              }}
            >
              {String(unit.value).padStart(2, '0')}
            </span>
            <EditableRichText
              value={unit.label}
              richValue={unit.richLabel}
              onSave={(newLabel) => {
                const richLabelKey = `${timeKey}LabelRich` as keyof CountdownTimerProps;
                props.onUpdate?.({ [richLabelKey]: newLabel } as any);
              }}
              editable={props.editable}
              className="text-xs uppercase mt-1"
              style={{
                fontSize: `${props.labelFontSize || 14}px`,
                color: labelColor,
              }}
            />
          </div>
          {props.showSeparator && i < timeUnits.length - 1 && (
            <span 
              className="font-bold"
              style={{
                fontSize: `${props.fontSize || 48}px`,
                color: props.numberColor || '#ffffff',
              }}
            >
              :
            </span>
          )}
        </React.Fragment>
      )})}
    </div>
  );

  const renderDigital = () => (
    <div 
      className={cn(
        "font-mono flex items-center",
        props.glowEffect && "drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]",
        isLowTime && props.pulseOnLowTime && "animate-pulse"
      )}
      style={{ gap: `${props.gap || 16}px` }}
    >
      {timeUnits.map((unit, i) => {
        const timeKey = getTimeKey(i);
        const hasChanged = prevValues && prevValues[timeKey] !== unit.value;
        return (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center">
            <div 
              className={cn(
                "font-bold tracking-wider flex items-center",
                props.animateNumbers && "transition-all duration-300 ease-out",
                hasChanged && props.animateNumbers && "scale-110"
              )}
              style={{
                fontSize: `${baseFontSize}px`,
                color: numberColor,
                fontWeight: props.fontWeight || '800',
                textShadow: props.glowEffect ? '0 0 20px currentColor, 0 0 40px currentColor' : 'none',
                fontFamily: 'monospace',
                gap: '4px',
              }}
            >
              {String(unit.value).padStart(2, '0').split('').map((digit, idx) => (
                <span 
                  key={idx}
                  className="inline-block"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  {digit}
                </span>
              ))}
            </div>
            <EditableRichText
              value={unit.label}
              richValue={unit.richLabel}
              onSave={(newLabel) => {
                const richLabelKey = `${timeKey}LabelRich` as keyof CountdownTimerProps;
                props.onUpdate?.({ [richLabelKey]: newLabel } as any);
              }}
              editable={props.editable}
              className="text-xs uppercase mt-1"
              style={{
                fontSize: `${props.labelFontSize || 12}px`,
                color: labelColor,
              }}
            />
          </div>
          {props.showSeparator && i < timeUnits.length - 1 && (
            <span 
              className="font-bold animate-pulse"
              style={{
                fontSize: `${props.fontSize || 56}px`,
                color: props.numberColor || '#22c55e',
              }}
            >
              :
            </span>
          )}
        </React.Fragment>
      )})}
    </div>
  );

  const renderFlip = () => {
    const renderFlipCard = (digit: string, prevDigit: string, flipKey: number, index: number, shouldAnimate: boolean) => {
      const isFlipping = shouldAnimate && digit !== prevDigit;
      const baseSize = props.fontSize || 48;
      const cardWidth = `${baseSize * 0.9}px`;
      const cardHeight = `${baseSize * 1.1}px`;
      const bgColor = props.backgroundColor || '#1f2937';
      const borderRadius = props.borderRadius || 8;
      
      return (
        <div
          key={`card-${flipKey}-${index}-${digit}`}
          className="relative"
          style={{
            width: cardWidth,
            height: cardHeight,
            perspective: '1000px',
            marginRight: index === 0 ? '3px' : '0',
          }}
        >
          {/* Simple card container */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundColor: bgColor,
              borderRadius: `${borderRadius}px`,
              overflow: 'hidden',
            }}
          >
            {/* Bottom half - always shows current digit */}
            <div 
              className="absolute bottom-0 left-0 right-0 flex items-start justify-center"
              style={{
                height: '50%',
                backgroundColor: bgColor,
              }}
            >
              <span 
                className="font-bold"
                style={{
                  fontSize: `${props.fontSize || 48}px`,
                  color: props.numberColor || '#ffffff',
                  fontWeight: props.fontWeight || '700',
                  lineHeight: 1,
                  transform: 'translateY(-50%)',
                }}
              >
                {digit}
              </span>
            </div>

            {/* Top half - shows current digit (will be covered by flip panel) */}
            <div 
              className="absolute top-0 left-0 right-0 flex items-end justify-center"
              style={{
                height: '50%',
                backgroundColor: bgColor,
              }}
            >
              <span 
                className="font-bold"
                style={{
                  fontSize: `${props.fontSize || 48}px`,
                  color: props.numberColor || '#ffffff',
                  fontWeight: props.fontWeight || '700',
                  lineHeight: 1,
                  transform: 'translateY(50%)',
                }}
              >
                {digit}
              </span>
            </div>

            {/* Simple divider line */}
            <div 
              className="absolute left-0 right-0 z-20"
              style={{
                top: '50%',
                height: '1px',
                backgroundColor: 'rgba(0,0,0,0.3)',
                transform: 'translateY(-0.5px)',
              }}
            />
          </div>

          {/* Animated flip panel - top half flips down - ONLY if digit changed */}
          {isFlipping && (
            <div 
              key={`flip-top-${flipKey}-${index}-${prevDigit}`}
              className="absolute top-0 left-0 right-0 flex items-end justify-center animate-flip-down"
              style={{
                height: '50%',
                backgroundColor: bgColor,
                borderRadius: `${borderRadius}px ${borderRadius}px 0 0`,
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
                transformOrigin: 'bottom center',
                zIndex: 30,
                overflow: 'hidden',
              }}
            >
              <span 
                className="font-bold"
                style={{
                  fontSize: `${props.fontSize || 48}px`,
                  color: props.numberColor || '#ffffff',
                  fontWeight: props.fontWeight || '700',
                  lineHeight: 1,
                  transform: 'translateY(50%)',
                }}
              >
                {prevDigit}
              </span>
            </div>
          )}

          {/* Animated flip panel - bottom half flips up - ONLY if digit changed */}
          {isFlipping && (
            <div 
              key={`flip-bottom-${flipKey}-${index}-${digit}`}
              className="absolute bottom-0 left-0 right-0 flex items-start justify-center animate-flip-up"
              style={{
                height: '50%',
                backgroundColor: bgColor,
                borderRadius: `0 0 ${borderRadius}px ${borderRadius}px`,
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
                transformOrigin: 'top center',
                zIndex: 30,
                overflow: 'hidden',
              }}
            >
              <span 
                className="font-bold"
                style={{
                  fontSize: `${props.fontSize || 48}px`,
                  color: props.numberColor || '#ffffff',
                  fontWeight: props.fontWeight || '700',
                  lineHeight: 1,
                  transform: 'translateY(-50%)',
                }}
              >
                {digit}
              </span>
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="flex items-center" style={{ gap: `${props.gap || 16}px` }}>
        {timeUnits.map((unit, i) => {
          const timeKey = getTimeKey(i);
          const currentDisplay = String(unit.value).padStart(2, '0');
          const prevValue = prevValues?.[timeKey];
          const prevDisplay = prevValue !== undefined ? String(prevValue).padStart(2, '0') : currentDisplay;
          const flipKey = flipKeys[timeKey] || 0;
          
          // Check if this unit's value actually changed (only animate if changed)
          const hasChanged = prevValue !== undefined && prevValue !== unit.value;
          
          // Split into individual digits
          const currentDigits = currentDisplay.split('');
          const prevDigits = prevDisplay.split('');
          
          return (
            <React.Fragment key={`${timeKey}-${flipKey}-${currentDisplay}`}>
              <div className="flex flex-col items-center">
                <div className="flex items-center" style={{ gap: '2px' }}>
                  {currentDigits.map((digit, digitIndex) => {
                    const prevDigit = prevDigits[digitIndex] ?? digit;
                    // Only animate if the unit value changed AND this specific digit changed
                    const digitChanged = hasChanged && digit !== prevDigit;
                    return renderFlipCard(digit, prevDigit, flipKey, digitIndex, digitChanged);
                  })}
                </div>
                <EditableText
                  value={unit.label}
                  onSave={(newLabel) => {
                    const labelKey = `${timeKey}Label` as keyof CountdownTimerProps;
                    props.onUpdate?.({ [labelKey]: newLabel } as any);
                  }}
                  editable={props.editable}
                  className="text-xs uppercase mt-2"
                  style={{
                    fontSize: `${props.labelFontSize || 12}px`,
                    color: labelColor,
                    letterSpacing: '0.05em',
                  }}
                />
              </div>
              {props.showSeparator && i < timeUnits.length - 1 && (
                <span 
                  className="font-bold"
                  style={{
                    fontSize: `${props.fontSize || 48}px`,
                    color: props.numberColor || '#ffffff',
                  }}
                >
                  :
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const renderCircular = () => {
    const size = (props.fontSize || 48) * 2;
    const strokeWidth = size * 0.1;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    
    return (
      <div className="flex items-center" style={{ gap: `${props.gap || 24}px` }}>
        {timeUnits.map((unit, i) => {
          const maxValue = i === 0 ? (props.displayFormat === 'full' ? 365 : 24) : (i === 1 ? 24 : 60);
          const progress = (unit.value / maxValue) * 100;
          const offset = circumference - (progress / 100) * circumference;
          
          return (
            <div key={i} className="flex flex-col items-center">
              <div className="relative" style={{ width: size, height: size }}>
                <svg className="transform -rotate-90" width={size} height={size}>
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={props.backgroundColor || '#e5e7eb'}
                    strokeWidth={strokeWidth}
                    fill="none"
                  />
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={props.numberColor || '#3b82f6'}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className={cn(
                      props.animateNumbers && "transition-all duration-1000",
                      isLowTime && props.pulseOnLowTime && "animate-pulse"
                    )}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span 
                    className="font-bold"
                    style={{
                      fontSize: `${props.fontSize || 48}px`,
                      color: props.numberColor || '#3b82f6',
                      fontWeight: props.fontWeight || '700',
                    }}
                  >
                    {String(unit.value).padStart(2, '0')}
                  </span>
                </div>
              </div>
              <EditableText
                value={unit.label}
                onSave={(newLabel) => {
                  const format = props.displayFormat || 'full';
                  const keys = format === 'full' ? ['days', 'hours', 'minutes', 'seconds'] :
                              format === 'hours' ? ['hours', 'minutes', 'seconds'] :
                              format === 'minutes' ? ['minutes', 'seconds'] : ['hours', 'minutes', 'seconds'];
                  const labelKey = `${keys[i]}Label` as keyof CountdownTimerProps;
                  props.onUpdate?.({ [labelKey]: newLabel } as any);
                }}
                editable={props.editable}
                className="text-xs uppercase mt-2"
                style={{
                  fontSize: `${props.labelFontSize || 12}px`,
                  color: labelColor,
                }}
              />
            </div>
          );
        })}
      </div>
    );
  };

  const renderCompact = () => (
    <div 
      className={cn(
        "font-mono font-bold",
        props.animateNumbers && "transition-all duration-300",
        isLowTime && props.pulseOnLowTime && "animate-pulse"
      )}
      style={{
        fontSize: `${props.fontSize || 48}px`,
        color: props.numberColor || '#000000',
        fontWeight: props.fontWeight || '700',
      }}
    >
      {timeUnits.map(u => String(u.value).padStart(2, '0')).join(':')}
    </div>
  );

  return (
    <div 
      className="w-full"
      style={{
        textAlign: (props.alignment || 'center') as any,
      }}
    >
      {props.title && (
        <h3 
          className="font-bold mb-4"
          style={{
            fontSize: `${props.titleFontSize || (props.fontSize || 48) * 0.4}px`,
            color: props.titleColor || props.numberColor || '#000000',
            textAlign: (props.alignment || 'center') as any,
            fontWeight: props.fontWeight || '700',
          }}
        >
          <EditableText
            value={props.title}
            onSave={(newTitle) => {
              console.log('🎯 CountdownTimer: Calling onUpdate with:', { title: newTitle });
              props.onUpdate?.({ title: newTitle });
            }}
            editable={props.editable}
            style={{
              fontSize: `${props.titleFontSize || (props.fontSize || 48) * 0.4}px`,
              color: props.titleColor || props.numberColor || '#000000',
              fontWeight: props.fontWeight || '700',
              textDecoration: props.textDecoration || 'none',
              textTransform: props.textTransform as any || 'none',
              letterSpacing: props.letterSpacing || 'normal',
              lineHeight: props.lineHeight || 'normal',
            }}
          />
        </h3>
      )}
      
      <div className="inline-flex items-center justify-center">
        {isCompact ? renderCompact() : 
         visualStyle === 'minimal' ? renderMinimal() :
         visualStyle === 'digital' ? renderDigital() :
         visualStyle === 'flip' ? renderFlip() :
         visualStyle === 'circular' ? renderCircular() :
         renderBoxed()}
      </div>
    </div>
  );
}
