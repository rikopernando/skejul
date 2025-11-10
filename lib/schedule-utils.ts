/**
 * Schedule-related utility functions
 */

import { SLOT_TOTAL_HEIGHT_PX, SLOT_COLORS, MAX_VISIBLE_OVERLAPPING_SLOTS } from './schedule-constants';
import { calculateDuration } from './schedule-time-utils';

/**
 * Calculate the height of a schedule slot based on its duration
 */
export function calculateSlotHeight(startTime: string, endTime: string): number {
  const durationMinutes = calculateDuration(startTime, endTime);
  const slotsCount = durationMinutes / 30; // Each slot is 30 minutes
  return slotsCount * SLOT_TOTAL_HEIGHT_PX - 4; // Subtract 4px for last gap
}

/**
 * Get color scheme for a slot based on its index
 */
export function getSlotColor(index: number) {
  return SLOT_COLORS[index % SLOT_COLORS.length];
}

/**
 * Get slots to display with visibility info
 */
export function getVisibleSlots<T>(slots: T[]) {
  const slotsToShow = slots.slice(0, MAX_VISIBLE_OVERLAPPING_SLOTS);
  const remainingCount = Math.max(0, slots.length - MAX_VISIBLE_OVERLAPPING_SLOTS);
  const hasMore = remainingCount > 0;

  return {
    slotsToShow,
    remainingCount,
    hasMore,
  };
}

/**
 * Calculate offset and z-index for stacked slots
 */
export function getSlotPosition(index: number, offset: number = 8) {
  return {
    offset: index * offset,
    zIndex: 10 + index,
  };
}
