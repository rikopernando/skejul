/**
 * Custom hook for managing schedule data and state
 */

import { useState, useEffect, useCallback } from 'react';
import { getScheduleSlotsForWeek } from '@/app/actions/schedule-actions';
import type { ScheduleSlot, ScheduleFilters } from '@/types/schedule';

export function useScheduleData(currentDate: Date, filters: ScheduleFilters) {
  const [slots, setSlots] = useState<ScheduleSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadScheduleData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getScheduleSlotsForWeek(currentDate, filters);
      setSlots(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load schedule data');
      setError(error);
      console.error('Failed to load schedule data:', error);
    } finally {
      setLoading(false);
    }
  }, [currentDate, filters]);

  useEffect(() => {
    loadScheduleData();
  }, [loadScheduleData]);

  return {
    slots,
    loading,
    error,
    refetch: loadScheduleData,
  };
}
