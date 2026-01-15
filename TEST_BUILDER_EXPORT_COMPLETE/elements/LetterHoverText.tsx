"use client";



import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import './letter-hover-animation.css';

interface LetterHoverTextProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  enabled?: boolean;
  scaleAmount?: number;
  duration?: number;
}

export function LetterHoverText({ 
  children, 
  className, 
  style,
  enabled = true,
  scaleAmount = 1.2,
  duration = 0.3
}: LetterHoverTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const processedRef = useRef(false);

  useEffect(() => {
    if (!enabled || !containerRef.current) {
      processedRef.current = false;
      return;
    }

    const container = containerRef.current;
    let timeoutId: NodeJS.Timeout;
    
    // Function to wrap text nodes with letter spans
    const wrapTextNodes = (node: Node): boolean => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || '';
        if (text.trim()) {
          const fragment = document.createDocumentFragment();
          
          for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const span = document.createElement('span');
            span.className = char === ' ' ? 'letter-space' : 'letter-hover-letter';
            span.textContent = char;
            fragment.appendChild(span);
          }
          
          node.parentNode?.replaceChild(fragment, node);
          return true;
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Skip script, style, and already processed elements
        const element = node as Element;
        if (
          element.tagName === 'SCRIPT' ||
          element.tagName === 'STYLE' ||
          element.classList.contains('letter-hover-letter') ||
          element.classList.contains('letter-space')
        ) {
          return false;
        }
        
        // Process children of ProseMirror (TipTap editor)
        if (element.classList.contains('ProseMirror')) {
          let hasProcessed = false;
          Array.from(element.childNodes).forEach((child) => {
            if (wrapTextNodes(child)) {
              hasProcessed = true;
            }
          });
          return hasProcessed;
        }
        
        // Recursively process child nodes
        let hasTextNodes = false;
        Array.from(node.childNodes).forEach((child) => {
          if (wrapTextNodes(child)) {
            hasTextNodes = true;
          }
        });
        return hasTextNodes;
      }
      return false;
    };

    // Process function with retry logic for async TipTap rendering
    const processText = () => {
      if (!containerRef.current) return;
      
      // Check if there's actual text content to process
      const hasText = containerRef.current.textContent && containerRef.current.textContent.trim().length > 0;
      
      if (hasText) {
        // Reset processed flag if content changed significantly
        const textContent = containerRef.current.textContent;
        if (textContent !== containerRef.current.getAttribute('data-last-text')) {
          processedRef.current = false;
          containerRef.current.setAttribute('data-last-text', textContent);
        }
        
        if (!processedRef.current) {
          // Process all text nodes in the container
          const processed = Array.from(container.childNodes).some(wrapTextNodes);
          if (processed) {
            processedRef.current = true;
          }
        }
      }
    };

    // Initial processing with delay to allow TipTap to render
    timeoutId = setTimeout(() => {
      processText();
    }, 150);

    // Use MutationObserver to watch for DOM changes (TipTap updates)
    const observer = new MutationObserver((mutations) => {
      // Check if mutations are significant (not just cursor/selection changes)
      const significantChange = mutations.some(mutation => 
        mutation.type === 'childList' || 
        (mutation.type === 'characterData' && mutation.target.textContent && mutation.target.textContent.trim().length > 0)
      );
      
      if (significantChange) {
        // Reset and reprocess after a short delay
        processedRef.current = false;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          processText();
        }, 100);
      }
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
      processedRef.current = false;
    };
  }, [enabled, children]);

  if (!enabled) {
    return <div className={className} style={style}>{children}</div>;
  }

  return (
    <div
      ref={containerRef}
      className={cn('letter-hover-container', className)}
      style={{
        ...style,
        '--scale-amount': scaleAmount,
        '--duration': `${duration}s`,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

