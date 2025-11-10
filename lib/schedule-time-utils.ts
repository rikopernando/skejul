/**
 * Time-related utility functions for schedule management
 */

import { SCHEDULE_START_HOUR, SCHEDULE_END_HOUR, TIME_SLOT_INTERVAL_MINUTES } from './schedule-constants';

/**
 * Generate time options for dropdowns
 * @param startHour - Starting hour (default: 7)
 * @param endHour - Ending hour (default: 18)
 * @param intervalMinutes - Interval in minutes (default: 15)
 * @returns Array of time strings in HH:MM format
 */
export function generateTimeOptions(
  startHour: number = SCHEDULE_START_HOUR,
  endHour: number = SCHEDULE_END_HOUR,
  intervalMinutes: number = TIME_SLOT_INTERVAL_MINUTES
): string[] {
  const times: string[] = [];

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      const timeString = formatTime(hour, minute);
      times.push(timeString);
    }
  }

  return times;
}

/**
 * Format hour and minute to HH:MM string
 */
export function formatTime(hour: number, minute: number): string {
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

/**
 * Parse time string to hours and minutes
 */
export function parseTime(timeString: string): { hour: number; minute: number } {
  const [hour, minute] = timeString.split(':').map(Number);
  return { hour, minute };
}

/**
 * Convert time string to total minutes since midnight
 */
export function timeToMinutes(timeString: string): number {
  const { hour, minute } = parseTime(timeString);
  return hour * 60 + minute;
}

/**
 * Convert total minutes to time string
 */
export function minutesToTime(totalMinutes: number): string {
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  return formatTime(hour, minute);
}

/**
 * Calculate duration in minutes between two time strings
 */
export function calculateDuration(startTime: string, endTime: string): number {
  if (!startTime || !endTime) return 0;

  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);

  return endMinutes - startMinutes;
}

/**
 * Add minutes to a time string
 */
export function addMinutesToTime(timeString: string, minutesToAdd: number): string {
  if (!timeString) return '';

  const totalMinutes = timeToMinutes(timeString) + minutesToAdd;
  return minutesToTime(totalMinutes);
}

/**
 * Check if end time is after start time
 */
export function isValidTimeRange(startTime: string, endTime: string): boolean {
  return endTime > startTime;
}

/**
 * Get filtered time options (only times after a given start time)
 */
export function getFilteredEndTimeOptions(startTime: string, allTimeOptions: string[]): string[] {
  if (!startTime) return allTimeOptions;
  return allTimeOptions.filter(time => time > startTime);
}
