/**
 * Schedule-related constants
 */

// Time configuration
export const SCHEDULE_START_HOUR = 7;
export const SCHEDULE_END_HOUR = 18;
export const TIME_SLOT_INTERVAL_MINUTES = 15;

// Days of the week
export const DAYS_OF_WEEK = [
  { value: 1, label: 'Monday', short: 'Mon' },
  { value: 2, label: 'Tuesday', short: 'Tue' },
  { value: 3, label: 'Wednesday', short: 'Wed' },
  { value: 4, label: 'Thursday', short: 'Thu' },
  { value: 5, label: 'Friday', short: 'Fri' },
  { value: 6, label: 'Saturday', short: 'Sat' },
  { value: 7, label: 'Sunday', short: 'Sun' },
] as const;

// Visual configuration
export const SLOT_HEIGHT_PX = 64;
export const SLOT_GAP_PX = 4;
export const SLOT_TOTAL_HEIGHT_PX = SLOT_HEIGHT_PX + SLOT_GAP_PX; // 68px per 30-min slot

export const MAX_VISIBLE_OVERLAPPING_SLOTS = 3;
export const SLOT_OFFSET_PX = 8;

// Color palette for overlapping schedules
export const SLOT_COLORS = [
  {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/30',
    border: 'border-blue-200 dark:border-blue-800'
  },
  {
    bg: 'bg-green-50 dark:bg-green-900/20',
    hover: 'hover:bg-green-100 dark:hover:bg-green-900/30',
    border: 'border-green-200 dark:border-green-800'
  },
  {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    hover: 'hover:bg-purple-100 dark:hover:bg-purple-900/30',
    border: 'border-purple-200 dark:border-purple-800'
  },
  {
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    hover: 'hover:bg-orange-100 dark:hover:bg-orange-900/30',
    border: 'border-orange-200 dark:border-orange-800'
  },
  {
    bg: 'bg-pink-50 dark:bg-pink-900/20',
    hover: 'hover:bg-pink-100 dark:hover:bg-pink-900/30',
    border: 'border-pink-200 dark:border-pink-800'
  },
] as const;

// Type definitions
export type DayOfWeek = typeof DAYS_OF_WEEK[number];
export type SlotColor = typeof SLOT_COLORS[number];
