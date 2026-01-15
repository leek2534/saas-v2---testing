"use client";



import { useState } from 'react';
import { Section } from './store';
import { useTestBuilderV2Store } from './store';
import { GripVertical, Trash2, Edit2, Check, X, Layout, ChevronUp, ChevronDown, Copy } from 'lucide-react';
import { RowComponent } from './RowComponent';
import { UnifiedPlaceholder } from '@/components/canvas/UnifiedPlaceholder';
import { cn } from '@/lib/utils';

// Consistent color for sections (blue)
const SECTION_COLOR = {
  ring: 'ring-blue-500/50',
  ringSelected: 'ring-blue-500',
  bg: 'bg-blue-500',
  bgLight: 'bg-blue-500/10',
  text: 'text-blue-500',
};

interface SectionComponentProps {
  section: Section;
  index: number;
  totalSections: number;
}

export function SectionComponent({ section, index, totalSections }: SectionComponentProps) {
  const {
    selectedSectionId,
    selectSection,
    deleteSection,
    renameSection,
    moveSection,
    duplicateSection,
    addRow,
    addSection,
    hoveredType,
    hoveredId,
    setHover,
    viewport,
    isResizing: globalIsResizing,
  } = useTestBuilderV2Store();

  // Section hover only shows when nothing else is hovered (lowest priority)
  const isHovered = hoveredType === 'section' && hoveredId === section.id;
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(section.name);
  const [showRowModal, setShowRowModal] = useState(false);

  const isSelected = selectedSectionId === section.id;

  const handleRename = () => {
    if (editName.trim()) {
      renameSection(section.id, editName.trim());
    }
    setIsEditing(false);
  };

  // Helper function to calculate safe max-width based on canvas viewport
  const getSafeMaxWidth = (): string => {
    const sectionMaxWidth = section.props.maxWidth;
    
    // If full-width, always allow 100%
    if (section.props.containerType === 'full-width') {
      return '100%';
    }

    // Get canvas viewport width
    const canvasWidth = viewport === 'mobile' ? 375 :
                       viewport === 'tablet' ? 768 :
                       1920; // Desktop max

    // Parse section max width
    let sectionWidth: number;
    if (sectionMaxWidth?.endsWith('px')) {
      sectionWidth = parseInt(sectionMaxWidth);
    } else if (sectionMaxWidth === '100%') {
      return '100%';
    } else {
      // Default widths based on container type
      sectionWidth = section.props.containerType === 'wide' ? 1280 :
                    section.props.containerType === 'medium' ? 1024 :
                    section.props.containerType === 'standard' ? 960 :
                    section.props.containerType === 'small' || section.props.containerType === 'narrow' ? 768 :
                    960;
    }

    // If section width exceeds canvas width, constrain to canvas width
    if (sectionWidth > canvasWidth) {
      return `${canvasWidth}px`;
    }

    return sectionMaxWidth || `${sectionWidth}px`;
  };

  const handleAddRow = (columnCount: 1 | 2 | 3 | 4 | 5 | 6) => {
    addRow(section.id, columnCount);
    setShowRowModal(false);
  };

  // Generate section background
  const generateSectionBackground = () => {
    const parts: string[] = [];
    
    // Add overlay if enabled
    if (section.props.backgroundOverlay?.enabled && section.props.backgroundImage) {
      const overlayColor = section.props.backgroundOverlay.color || '#000000';
      const overlayOpacity = (section.props.backgroundOverlay.opacity || 50) / 100;
      const rgba = overlayColor.startsWith('#') 
        ? `rgba(${parseInt(overlayColor.slice(1, 3), 16)}, ${parseInt(overlayColor.slice(3, 5), 16)}, ${parseInt(overlayColor.slice(5, 7), 16)}, ${overlayOpacity})`
        : overlayColor;
      parts.push(`linear-gradient(${rgba}, ${rgba})`);
    }
    
    // Add background image
    if (section.props.backgroundImage) {
      parts.push(`url(${section.props.backgroundImage})`);
    }
    
    // Add gradient
    if (section.props.backgroundGradient && !section.props.backgroundImage) {
      const sortedStops = [...section.props.backgroundGradient.stops].sort((a, b) => a.position - b.position);
      const stopsString = sortedStops.map((stop) => `${stop.color} ${stop.position}%`).join(', ');
      if (section.props.backgroundGradient.type === 'linear') {
        return `linear-gradient(${section.props.backgroundGradient.angle}deg, ${stopsString})`;
      } else {
        return `radial-gradient(circle, ${stopsString})`;
      }
    }
    
    return parts.length > 0 ? parts.join(', ') : (section.props.backgroundColor || 'transparent');
  };

  return (
    <div className="relative w-full">
      {/* Section Header Bar - REMOVED */}
      {false && isHovered && (
        <div 
          data-header-bar="section"
          className="absolute flex items-center z-[100]"
          style={{ 
            pointerEvents: 'auto', 
            left: '0px', // Aligned with the blue ring
            top: '0px', // At the top corner
          }}
        >
          {/* Name container - Left side */}
          <div className="flex items-center gap-1.5 px-2 py-1 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 rounded-br-md shadow-xl border-r border-b border-blue-400/40 backdrop-blur-sm">
            {/* Drag Handle */}
            <button 
              className="cursor-move hover:bg-white/20 p-0.5 rounded transition-all duration-200 hover:scale-110 active:scale-95"
              title="Drag to reorder"
            >
              <GripVertical size={12} className="text-white drop-shadow-sm" />
            </button>

            {/* Section Name */}
            {isEditing ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRename();
                    if (e.key === 'Escape') {
                      setEditName(section.name);
                      setIsEditing(false);
                    }
                  }}
                  className="bg-white/25 text-white placeholder-white/70 px-1.5 py-0.5 rounded text-[10px] w-28 h-5 focus:outline-none focus:ring-1 focus:ring-white/50 focus:bg-white/35 border border-white/20"
                  autoFocus
                  onBlur={handleRename}
                />
                <button
                  onClick={handleRename}
                  className="hover:bg-green-500/30 p-0.5 rounded transition-colors"
                  title="Save"
                >
                  <Check size={10} className="text-green-100" />
                </button>
                <button
                  onClick={() => {
                    setEditName(section.name);
                    setIsEditing(false);
                  }}
                  className="hover:bg-red-500/30 p-0.5 rounded transition-colors"
                  title="Cancel"
                >
                  <X size={10} className="text-red-100" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 group">
                <span className="text-[10px] font-bold tracking-wide uppercase text-white drop-shadow-sm">
                  {section.name}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  className="opacity-0 group-hover:opacity-100 hover:bg-white/20 p-0.5 rounded transition-all duration-200"
                  title="Rename section"
                >
                  <Edit2 size={9} className="text-white/90" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Section Actions - REMOVED */}
      {false && isHovered && (
        <div 
          data-header-bar="section-actions"
          className="absolute flex items-center z-[100]"
          style={{ 
            pointerEvents: 'auto', 
            right: '0px', // Right corner
            top: '0px', // At the top corner
          }}
        >
          {/* Actions container - Right side */}
          <div className="flex items-center gap-0.5 px-1.5 py-1 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 rounded-bl-md shadow-xl border-l border-b border-blue-400/40 backdrop-blur-sm">
            {/* Move Up */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                moveSection(section.id, 'up');
              }}
              disabled={index === 0}
              className="hover:bg-white/20 p-1 rounded transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent hover:scale-110 active:scale-95"
              title="Move Up"
            >
              <ChevronUp size={12} className="text-white drop-shadow-sm" />
            </button>

            {/* Move Down */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                moveSection(section.id, 'down');
              }}
              disabled={index === totalSections - 1}
              className="hover:bg-white/20 p-1 rounded transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent hover:scale-110 active:scale-95"
              title="Move Down"
            >
              <ChevronDown size={12} className="text-white drop-shadow-sm" />
            </button>

            {/* Divider */}
            <div className="w-px h-3 bg-white/20 mx-0.5" />

            {/* Duplicate */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                duplicateSection(section.id);
              }}
              className="hover:bg-white/20 p-1 rounded transition-all duration-200 hover:scale-110 active:scale-95"
              title="Duplicate Section"
            >
              <Copy size={12} className="text-white drop-shadow-sm" />
            </button>

            {/* Delete */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteSection(section.id);
              }}
              className="hover:bg-red-500/40 p-1 rounded transition-all duration-200 hover:scale-110 active:scale-95"
              title="Delete Section"
            >
              <Trash2 size={12} className="text-red-100 drop-shadow-sm" />
            </button>
          </div>
        </div>
      )}

      <div 
        data-section-id={section.id}
        className="relative w-full transition-all duration-300 ease-in-out isolate min-h-[100px]"
        style={{
          background: section.props.backgroundVideo ? 'transparent' : generateSectionBackground(),
          backgroundSize: section.props.backgroundSize || 'cover',
          backgroundPosition: section.props.backgroundPosition || 'center',
          backgroundRepeat: section.props.backgroundRepeat || 'no-repeat',
          minHeight: section.props.backgroundVideo ? '600px' : `${section.props.minHeight || 0}px`, // Ensure height for video
          paddingTop: `${section.props.paddingTop || 40}px`,
          paddingBottom: `${section.props.paddingBottom || 40}px`,
          paddingLeft: `${section.props.paddingLeft || 20}px`,
          paddingRight: `${section.props.paddingRight || 20}px`,
        }}
        onMouseEnter={(e) => {
          e.stopPropagation();
          // Don't set hover if resize is active
          if (!globalIsResizing) {
            setHover('section', section.id);
          }
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
          // Don't clear hover if resize is active
          if (!globalIsResizing) {
            setHover(null, null);
          }
        }}
        onClick={(e) => {
          e.stopPropagation();
          selectSection(section.id);
        }}
      >
        {/* Outline Border - Very subtle, only for orientation */}
        {isHovered && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: 1,
              border: '2.5px solid rgba(96, 165, 250, 0.4)',
              transition: 'opacity 150ms ease-in',
            }}
          />
        )}
      {/* Video Background */}
      {section.props.backgroundVideo && (
        <div 
          className="absolute inset-0 w-full h-full overflow-hidden z-0"
          style={{ 
            minHeight: '400px', // Ensure minimum height for video visibility
            backgroundColor: '#000' // Fallback while video loads
          }}
        >
          <video
            key={section.props.backgroundVideo} // Force re-render on URL change
            className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover"
            autoPlay
            loop={section.props.backgroundVideoSettings?.loop ?? true}
            muted={section.props.backgroundVideoSettings?.muted ?? true}
            playsInline
            preload="auto"
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback"
            style={{ pointerEvents: 'none' }}
            onError={(e) => {
              console.error('Video failed to load:', section.props.backgroundVideo);
              console.error('Error details:', e);
            }}
            ref={(el) => {
              if (el) {
                console.log('Video element mounted with URL:', section.props.backgroundVideo);
                el.playbackRate = section.props.backgroundVideoSettings?.playbackSpeed || 1;
                // Force play on mount
                const playPromise = el.play();
                if (playPromise !== undefined) {
                  playPromise.catch((error) => {
                    console.log('Video autoplay prevented:', error);
                    console.log('Video URL:', section.props.backgroundVideo);
                  });
                }
              }
            }}
            onLoadedData={(e) => {
              console.log('Video data loaded successfully');
              // Ensure video plays when loaded
              const video = e.target as HTMLVideoElement;
              video.play().catch((error) => {
                console.log('Video play on load prevented:', error);
              });
            }}
            onCanPlay={() => {
              console.log('Video can play');
            }}
          >
            <source src={section.props.backgroundVideo} type="video/mp4" />
            <source src={section.props.backgroundVideo} type="video/webm" />
            <source src={section.props.backgroundVideo} type="video/ogg" />
            Your browser does not support video backgrounds.
          </video>
          {/* Video Overlay */}
          {section.props.backgroundOverlay?.enabled && (
            <div 
              className="absolute inset-0"
              style={{
                backgroundColor: section.props.backgroundOverlay.color || '#000000',
                opacity: (section.props.backgroundOverlay.opacity || 50) / 100
              }}
            />
          )}
        </div>
      )}

      {/* Content Container - Constrained to webpage content area with viewport-aware scaling */}
      <div 
        className={cn(
          "relative z-10 w-full mx-auto",
          // Padding adjustments
          section.props.containerType === 'full-width' ? "px-0" : "px-5 max-md:px-4"
        )}
        style={{
          maxWidth: getSafeMaxWidth(),
        }}
      >
        {section.rows.length === 0 ? (
          <div className="w-full h-full py-12">
            <UnifiedPlaceholder
              icon={Layout}
              title="No rows in this section"
              description="Click below to add a row"
              color="blue"
              size="lg"
            />
            <div className="flex justify-center mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowRowModal(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                Add Row
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col">
            {section.rows.map((row, rowIndex) => (
              <RowComponent
                key={row.id}
                row={row}
                sectionId={section.id}
                index={rowIndex}
                totalRows={section.rows.length}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Row Modal */}
      {showRowModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[9998]"
            onClick={() => setShowRowModal(false)}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-md">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 border-2 border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Choose Column Layout</h3>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map((count) => (
                  <button
                    key={count}
                    onClick={() => handleAddRow(count as 1 | 2 | 3 | 4 | 5 | 6)}
                    className="p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                  >
                    <div className="flex gap-1 mb-2">
                      {Array.from({ length: count }).map((_, i) => (
                        <div key={i} className="flex-1 h-8 bg-blue-200 dark:bg-blue-800 rounded" />
                      ))}
                    </div>
                    <p className="text-xs font-medium text-center">
                      {count} Column{count > 1 ? 's' : ''}
                    </p>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowRowModal(false)}
                className="mt-4 w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
      </div>
    </div>
  );
}
