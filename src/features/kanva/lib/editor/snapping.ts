import type { EditorElement } from './types';

export interface SnapLine {
  position: number;
  orientation: 'vertical' | 'horizontal';
  guide: boolean;
}

export interface SnapResult {
  x: number;
  y: number;
  snapped: boolean;
  snapLines: SnapLine[];
}

const SNAP_THRESHOLD = 5; // pixels

/**
 * Calculate snapping positions for an element
 * Returns adjusted position if close to guides or other elements
 */
export function calculateSnapping(
  element: { x: number; y: number; width: number; height: number },
  otherElements: EditorElement[],
  artboardWidth: number,
  artboardHeight: number
): SnapResult {
  const snapLines: SnapLine[] = [];
  let snappedX = element.x;
  let snappedY = element.y;
  let snapped = false;

  // Element edges
  const elementLeft = element.x;
  const elementRight = element.x + element.width;
  const elementTop = element.y;
  const elementBottom = element.y + element.height;
  const elementCenterX = element.x + element.width / 2;
  const elementCenterY = element.y + element.height / 2;

  // Artboard guides (center, edges)
  const artboardCenterX = artboardWidth / 2;
  const artboardCenterY = artboardHeight / 2;

  // Check artboard center snapping
  if (Math.abs(elementCenterX - artboardCenterX) < SNAP_THRESHOLD) {
    snappedX = artboardCenterX - element.width / 2;
    snapped = true;
    snapLines.push({
      position: artboardCenterX,
      orientation: 'vertical',
      guide: true,
    });
  }

  if (Math.abs(elementCenterY - artboardCenterY) < SNAP_THRESHOLD) {
    snappedY = artboardCenterY - element.height / 2;
    snapped = true;
    snapLines.push({
      position: artboardCenterY,
      orientation: 'horizontal',
      guide: true,
    });
  }

  // Check other elements
  for (const other of otherElements) {
    if (!other.visible) continue;

    const otherLeft = other.x;
    const otherRight = other.x + other.width;
    const otherTop = other.y;
    const otherBottom = other.y + other.height;
    const otherCenterX = other.x + other.width / 2;
    const otherCenterY = other.y + other.height / 2;

    // Vertical snapping (left, center, right)
    if (Math.abs(elementLeft - otherLeft) < SNAP_THRESHOLD) {
      snappedX = otherLeft;
      snapped = true;
      snapLines.push({ position: otherLeft, orientation: 'vertical', guide: false });
    } else if (Math.abs(elementRight - otherRight) < SNAP_THRESHOLD) {
      snappedX = otherRight - element.width;
      snapped = true;
      snapLines.push({ position: otherRight, orientation: 'vertical', guide: false });
    } else if (Math.abs(elementCenterX - otherCenterX) < SNAP_THRESHOLD) {
      snappedX = otherCenterX - element.width / 2;
      snapped = true;
      snapLines.push({ position: otherCenterX, orientation: 'vertical', guide: false });
    }

    // Horizontal snapping (top, center, bottom)
    if (Math.abs(elementTop - otherTop) < SNAP_THRESHOLD) {
      snappedY = otherTop;
      snapped = true;
      snapLines.push({ position: otherTop, orientation: 'horizontal', guide: false });
    } else if (Math.abs(elementBottom - otherBottom) < SNAP_THRESHOLD) {
      snappedY = otherBottom - element.height;
      snapped = true;
      snapLines.push({ position: otherBottom, orientation: 'horizontal', guide: false });
    } else if (Math.abs(elementCenterY - otherCenterY) < SNAP_THRESHOLD) {
      snappedY = otherCenterY - element.height / 2;
      snapped = true;
      snapLines.push({ position: otherCenterY, orientation: 'horizontal', guide: false });
    }
  }

  return {
    x: snappedX,
    y: snappedY,
    snapped,
    snapLines,
  };
}



