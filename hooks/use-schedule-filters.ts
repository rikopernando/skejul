/**
 * Custom hook for managing schedule filters
 */

import { useState, useMemo } from 'react';
import type { ScheduleFilters } from '@/types/schedule';

export function useScheduleFilters() {
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('all');

  const filters: ScheduleFilters = useMemo(() => {
    const result: ScheduleFilters = {};

    if (selectedClass && selectedClass !== 'all') {
      result.classId = selectedClass;
    }

    if (selectedTeacher && selectedTeacher !== 'all') {
      result.teacherId = selectedTeacher;
    }

    return result;
  }, [selectedClass, selectedTeacher]);

  return {
    selectedClass,
    selectedTeacher,
    setSelectedClass,
    setSelectedTeacher,
    filters,
  };
}
