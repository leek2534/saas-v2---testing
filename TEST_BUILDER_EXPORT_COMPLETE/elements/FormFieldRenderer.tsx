'use client';

/**
 * FormFieldRenderer - Renders individual form fields based on their type
 * Supports all field types from FormFieldBuilder
 */

import React, { useState } from 'react';
import { FormField } from '../element-settings/shared/FormFieldBuilder';
import { cn } from '@/lib/utils';
import { Star, Heart, ThumbsUp, TrendingUp } from 'lucide-react';

interface FormFieldRendererProps {
  field: FormField;
  value?: any;
  onChange?: (value: any) => void;
  errors?: Record<string, string>;
  viewMode?: 'edit' | 'preview' | 'live';
}

export function FormFieldRenderer({
  field,
  value,
  onChange,
  errors,
  viewMode = 'live',
}: FormFieldRendererProps) {
  const [localValue, setLocalValue] = useState(value || field.defaultValue || '');
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const handleChange = (newValue: any) => {
    setLocalValue(newValue);
    onChange?.(newValue);
  };

  const fieldValue = value !== undefined ? value : localValue;
  const hasError = errors && errors[field.id];
  const isReadOnly = viewMode === 'preview';

  // Width classes
  const widthClasses = {
    full: 'w-full',
    half: 'w-full md:w-1/2',
    third: 'w-full md:w-1/3',
    quarter: 'w-full md:w-1/4',
  };

  // Layout elements (heading, text-block, divider, pagebreak)
  if (field.type === 'heading') {
    const HeadingTag = `h${field.props?.level || 2}` as keyof JSX.IntrinsicElements;
    return (
      <HeadingTag
        className={cn(
          'font-bold',
          field.props?.level === 1 && 'text-4xl',
          field.props?.level === 2 && 'text-3xl',
          field.props?.level === 3 && 'text-2xl',
          field.props?.level === 4 && 'text-xl',
          field.props?.level === 5 && 'text-lg',
          field.props?.level === 6 && 'text-base',
          field.props?.align === 'center' && 'text-center',
          field.props?.align === 'right' && 'text-right',
        )}
      >
        {field.label}
      </HeadingTag>
    );
  }

  if (field.type === 'text-block') {
    return (
      <div
        className={cn(
          'text-base',
          field.props?.align === 'center' && 'text-center',
          field.props?.align === 'right' && 'text-right',
        )}
      >
        {field.label}
      </div>
    );
  }

  if (field.type === 'divider') {
    return <hr className="my-4 border-border" />;
  }

  if (field.type === 'pagebreak') {
    return (
      <div className="my-8 py-6 border-t-2 border-b-2 border-dashed border-border">
        {field.props?.showProgress && (
          <div className="mb-4">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: '50%' }} />
            </div>
          </div>
        )}
        <h3 className="text-lg font-semibold text-center text-muted-foreground">
          {field.props?.pageTitle || 'Page Break'}
        </h3>
      </div>
    );
  }

  // Hidden field
  if (field.type === 'hidden') {
    return (
      <input
        type="hidden"
        name={field.name}
        value={fieldValue}
        readOnly
      />
    );
  }

  // Main field wrapper
  return (
    <div className={cn('space-y-1', widthClasses[field.width])}>
      {/* Label */}
      {field.styling?.labelPosition !== 'hidden' && (
        <label
          className={cn(
            'block text-sm font-medium text-foreground',
            field.required && "after:content-['*'] after:ml-1 after:text-red-500",
            field.styling?.labelPosition === 'left' && 'flex items-center gap-2',
          )}
          style={field.styling?.labelStyle}
        >
          {field.styling?.labelPosition === 'left' && (
            <span className="w-32">{field.label}</span>
          )}
          {field.styling?.labelPosition !== 'left' && field.label}
        </label>
      )}

      {/* Field Input */}
      <div className="relative">
        {field.type === 'text' && (
          <input
            type="text"
            name={field.name}
            value={fieldValue}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            disabled={isReadOnly}
            className={cn(
              'w-full px-3 py-2 border rounded-lg bg-background text-foreground',
              hasError ? 'border-red-500' : 'border-border',
              isReadOnly && 'opacity-50 cursor-not-allowed',
            )}
            style={field.styling?.fieldStyle}
          />
        )}

        {field.type === 'email' && (
          <input
            type="email"
            name={field.name}
            value={fieldValue}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            disabled={isReadOnly}
            className={cn(
              'w-full px-3 py-2 border rounded-lg bg-background text-foreground',
              hasError ? 'border-red-500' : 'border-border',
              isReadOnly && 'opacity-50 cursor-not-allowed',
            )}
          />
        )}

        {field.type === 'tel' && (
          <input
            type="tel"
            name={field.name}
            value={fieldValue}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            disabled={isReadOnly}
            className={cn(
              'w-full px-3 py-2 border rounded-lg bg-background text-foreground',
              hasError ? 'border-red-500' : 'border-border',
              isReadOnly && 'opacity-50 cursor-not-allowed',
            )}
          />
        )}

        {field.type === 'url' && (
          <input
            type="url"
            name={field.name}
            value={fieldValue}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            disabled={isReadOnly}
            className={cn(
              'w-full px-3 py-2 border rounded-lg bg-background text-foreground',
              hasError ? 'border-red-500' : 'border-border',
              isReadOnly && 'opacity-50 cursor-not-allowed',
            )}
          />
        )}

        {field.type === 'password' && (
          <input
            type="password"
            name={field.name}
            value={fieldValue}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            disabled={isReadOnly}
            className={cn(
              'w-full px-3 py-2 border rounded-lg bg-background text-foreground',
              hasError ? 'border-red-500' : 'border-border',
              isReadOnly && 'opacity-50 cursor-not-allowed',
            )}
          />
        )}

        {field.type === 'textarea' && (
          <textarea
            name={field.name}
            value={fieldValue}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            disabled={isReadOnly}
            rows={4}
            className={cn(
              'w-full px-3 py-2 border rounded-lg bg-background text-foreground resize-y',
              hasError ? 'border-red-500' : 'border-border',
              isReadOnly && 'opacity-50 cursor-not-allowed',
            )}
          />
        )}

        {field.type === 'number' && (
          <input
            type="number"
            name={field.name}
            value={fieldValue}
            onChange={(e) => handleChange(parseFloat(e.target.value) || '')}
            placeholder={field.placeholder}
            required={field.required}
            disabled={isReadOnly}
            min={field.validation?.min}
            max={field.validation?.max}
            step="any"
            className={cn(
              'w-full px-3 py-2 border rounded-lg bg-background text-foreground',
              hasError ? 'border-red-500' : 'border-border',
              isReadOnly && 'opacity-50 cursor-not-allowed',
            )}
          />
        )}

        {field.type === 'date' && (
          <input
            type="date"
            name={field.name}
            value={fieldValue}
            onChange={(e) => handleChange(e.target.value)}
            required={field.required}
            disabled={isReadOnly}
            min={field.validation?.min}
            max={field.validation?.max}
            className={cn(
              'w-full px-3 py-2 border rounded-lg bg-background text-foreground',
              hasError ? 'border-red-500' : 'border-border',
              isReadOnly && 'opacity-50 cursor-not-allowed',
            )}
          />
        )}

        {field.type === 'time' && (
          <input
            type="time"
            name={field.name}
            value={fieldValue}
            onChange={(e) => handleChange(e.target.value)}
            required={field.required}
            disabled={isReadOnly}
            className={cn(
              'w-full px-3 py-2 border rounded-lg bg-background text-foreground',
              hasError ? 'border-red-500' : 'border-border',
              isReadOnly && 'opacity-50 cursor-not-allowed',
            )}
          />
        )}

        {field.type === 'datetime-local' && (
          <input
            type="datetime-local"
            name={field.name}
            value={fieldValue}
            onChange={(e) => handleChange(e.target.value)}
            required={field.required}
            disabled={isReadOnly}
            className={cn(
              'w-full px-3 py-2 border rounded-lg bg-background text-foreground',
              hasError ? 'border-red-500' : 'border-border',
              isReadOnly && 'opacity-50 cursor-not-allowed',
            )}
          />
        )}

        {field.type === 'select' && (
          <select
            name={field.name}
            value={fieldValue}
            onChange={(e) => handleChange(e.target.value)}
            required={field.required}
            disabled={isReadOnly}
            className={cn(
              'w-full px-3 py-2 border rounded-lg bg-background text-foreground',
              hasError ? 'border-red-500' : 'border-border',
              isReadOnly && 'opacity-50 cursor-not-allowed',
            )}
          >
            <option value="">Select an option...</option>
            {field.options?.map((opt, i) => (
              <option key={i} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {field.type === 'multiselect' && (
          <select
            name={field.name}
            multiple
            value={Array.isArray(fieldValue) ? fieldValue : []}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, opt => opt.value);
              handleChange(selected);
            }}
            required={field.required}
            disabled={isReadOnly}
            className={cn(
              'w-full px-3 py-2 border rounded-lg bg-background text-foreground min-h-[100px]',
              hasError ? 'border-red-500' : 'border-border',
              isReadOnly && 'opacity-50 cursor-not-allowed',
            )}
          >
            {field.options?.map((opt, i) => (
              <option key={i} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {field.type === 'radio' && (
          <div className="space-y-2">
            {field.options?.map((opt, i) => (
              <label key={i} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={field.name}
                  value={opt.value}
                  checked={fieldValue === opt.value}
                  onChange={(e) => handleChange(e.target.value)}
                  required={field.required}
                  disabled={isReadOnly}
                  className="cursor-pointer"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        )}

        {field.type === 'checkbox' && (
          <div className="space-y-2">
            {field.options?.map((opt, i) => {
              const checkedValues = Array.isArray(fieldValue) ? fieldValue : [];
              const isChecked = checkedValues.includes(opt.value);
              return (
                <label key={i} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name={field.name}
                    value={opt.value}
                    checked={isChecked}
                    onChange={(e) => {
                      const currentValues = Array.isArray(fieldValue) ? fieldValue : [];
                      if (e.target.checked) {
                        handleChange([...currentValues, opt.value]);
                      } else {
                        handleChange(currentValues.filter(v => v !== opt.value));
                      }
                    }}
                    disabled={isReadOnly}
                    className="cursor-pointer"
                  />
                  <span>{opt.label}</span>
                </label>
              );
            })}
          </div>
        )}

        {field.type === 'file' && (
          <div>
            <input
              type="file"
              name={field.name}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleChange(file);
                  // Preview for images
                  if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => setFilePreview(e.target?.result as string);
                    reader.readAsDataURL(file);
                  }
                }
              }}
              accept={field.props?.accept}
              multiple={field.props?.multiple}
              required={field.required}
              disabled={isReadOnly}
              className={cn(
                'w-full px-3 py-2 border rounded-lg bg-background text-foreground',
                hasError ? 'border-red-500' : 'border-border',
                isReadOnly && 'opacity-50 cursor-not-allowed',
              )}
            />
            {filePreview && (
              <img src={filePreview} alt="Preview" className="mt-2 max-w-xs rounded" />
            )}
          </div>
        )}

        {field.type === 'image' && (
          <div>
            <input
              type="file"
              name={field.name}
              accept={field.props?.accept || 'image/*'}
              multiple={field.props?.multiple}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleChange(file);
                  const reader = new FileReader();
                  reader.onload = (e) => setFilePreview(e.target?.result as string);
                  reader.readAsDataURL(file);
                }
              }}
              required={field.required}
              disabled={isReadOnly}
              className={cn(
                'w-full px-3 py-2 border rounded-lg bg-background text-foreground',
                hasError ? 'border-red-500' : 'border-border',
                isReadOnly && 'opacity-50 cursor-not-allowed',
              )}
            />
            {filePreview && (
              <img src={filePreview} alt="Preview" className="mt-2 max-w-xs rounded" />
            )}
          </div>
        )}

        {field.type === 'rating' && (
          <div className="flex items-center gap-2">
            {Array.from({ length: field.props?.maxRating || 5 }).map((_, i) => {
              const rating = i + 1;
              const Icon = field.props?.icon === 'heart' ? Heart : 
                          field.props?.icon === 'thumb' ? ThumbsUp : Star;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => !isReadOnly && handleChange(rating)}
                  disabled={isReadOnly}
                  className={cn(
                    'transition-colors',
                    rating <= (fieldValue || 0) ? 'text-yellow-500' : 'text-gray-300',
                    isReadOnly && 'cursor-not-allowed',
                  )}
                >
                  <Icon size={24} fill={rating <= (fieldValue || 0) ? 'currentColor' : 'none'} />
                </button>
              );
            })}
            <input type="hidden" name={field.name} value={fieldValue || ''} />
          </div>
        )}

        {field.type === 'nps' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{field.props?.minLabel || 'Not likely'}</span>
              <span className="text-sm text-muted-foreground">{field.props?.maxLabel || 'Very likely'}</span>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 11 }).map((_, i) => {
                const score = i;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => !isReadOnly && handleChange(score)}
                    disabled={isReadOnly}
                    className={cn(
                      'flex-1 py-2 border rounded transition-colors',
                      fieldValue === score ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border',
                      isReadOnly && 'cursor-not-allowed',
                    )}
                  >
                    {score}
                  </button>
                );
              })}
            </div>
            <input type="hidden" name={field.name} value={fieldValue || ''} />
          </div>
        )}

        {field.type === 'matrix' && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-border p-2 text-left"></th>
                  {field.props?.columns?.map((col, i) => (
                    <th key={i} className="border border-border p-2 text-center text-sm">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {field.props?.rows?.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="border border-border p-2 text-sm font-medium">{row.label}</td>
                    {field.props?.columns?.map((col, colIndex) => {
                      const cellValue = `${row.value}_${col.value}`;
                      const isChecked = fieldValue === cellValue;
                      return (
                        <td key={colIndex} className="border border-border p-2 text-center">
                          <input
                            type="radio"
                            name={`${field.name}_${row.value}`}
                            value={cellValue}
                            checked={isChecked}
                            onChange={() => !isReadOnly && handleChange(cellValue)}
                            disabled={isReadOnly}
                            className="cursor-pointer"
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {field.type === 'slider' && (
          <div className="space-y-2">
            <input
              type="range"
              name={field.name}
              value={fieldValue || field.validation?.min || 0}
              onChange={(e) => handleChange(parseFloat(e.target.value))}
              min={field.validation?.min || 0}
              max={field.validation?.max || 100}
              step={field.props?.step || 1}
              disabled={isReadOnly}
              className="w-full"
            />
            {field.props?.showValue && (
              <div className="text-center text-sm font-medium">
                {fieldValue || field.validation?.min || 0}
              </div>
            )}
          </div>
        )}

        {field.type === 'consent' && (
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              name={field.name}
              checked={!!fieldValue}
              onChange={(e) => handleChange(e.target.checked)}
              required={field.required}
              disabled={isReadOnly}
              className="mt-1 cursor-pointer"
            />
            <span className="text-sm">
              {field.label}{' '}
              {field.props?.linkText && (
                <a href={field.props?.linkUrl || '#'} className="text-primary underline" target="_blank" rel="noopener noreferrer">
                  {field.props.linkText}
                </a>
              )}
            </span>
          </label>
        )}

        {field.type === 'terms' && (
          <div className="space-y-2">
            <div className="text-sm">{field.label}</div>
            {field.props?.linkText && (
              <a href={field.props?.linkUrl || '#'} className="text-primary underline text-sm" target="_blank" rel="noopener noreferrer">
                {field.props.linkText}
              </a>
            )}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name={field.name}
                checked={!!fieldValue}
                onChange={(e) => handleChange(e.target.checked)}
                required={field.required}
                disabled={isReadOnly}
                className="cursor-pointer"
              />
              <span className="text-sm">I agree to the terms and conditions</span>
            </label>
          </div>
        )}
      </div>

      {/* Help Text */}
      {field.helpText && (
        <p className="text-xs text-muted-foreground">{field.helpText}</p>
      )}

      {/* Error Message */}
      {hasError && (
        <p className="text-xs text-red-500">{hasError}</p>
      )}
    </div>
  );
}











