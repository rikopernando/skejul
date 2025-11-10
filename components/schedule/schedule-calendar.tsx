'use client';

/**
 * ScheduleCalendar - Main schedule calendar component (Refactored)
 *
 * This component orchestrates the schedule view with:
 * - Week navigation
 * - Class and teacher filters
 * - Schedule grid display
 * - Modal interactions for creating/editing schedules
 */

import { useState, useCallback } from 'react';
import { addDays } from 'date-fns';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ScheduleSlot } from '@/types/schedule';
import { useScheduleData } from '@/hooks/use-schedule-data';
import { useScheduleFilters } from '@/hooks/use-schedule-filters';
import { ScheduleFilters } from './schedule-filters';
import { ScheduleWeekNavigation } from './schedule-week-navigation';
import { ScheduleGrid } from './schedule-grid';
import { CreateScheduleModal } from './create-schedule-modal';
import { ScheduleDetailModal } from './schedule-detail-modal';
import { ScheduleListModal } from './schedule-list-modal';

export function ScheduleCalendar() {
  // Date state
  const [currentDate, setCurrentDate] = useState(new Date());

  // Filter state
  const {
    selectedClass,
    selectedTeacher,
    setSelectedClass,
    setSelectedTeacher,
    filters,
  } = useScheduleFilters();

  // Schedule data
  const { slots, loading, refetch } = useScheduleData(currentDate, filters);

  // Modal state for creating schedules
  const [createModalState, setCreateModalState] = useState<{
    isOpen: boolean;
    defaultDayOfWeek?: number;
    defaultStartTime?: string;
  }>({
    isOpen: false,
  });

  // Modal state for viewing/editing schedules
  const [detailModalState, setDetailModalState] = useState<{
    isOpen: boolean;
    slot: ScheduleSlot | null;
  }>({
    isOpen: false,
    slot: null,
  });

  // Modal state for viewing list of overlapping schedules
  const [listModalState, setListModalState] = useState<{
    isOpen: boolean;
    slots: ScheduleSlot[];
  }>({
    isOpen: false,
    slots: [],
  });

  // Navigate to previous or next week
  const handleNavigateWeek = useCallback((direction: 'prev' | 'next') => {
    const days = direction === 'prev' ? -7 : 7;
    setCurrentDate(prev => addDays(prev, days));
  }, []);

  // Open create modal (with optional pre-filled values)
  const handleCreateSlot = useCallback((dayIndex: number, time: string) => {
    setCreateModalState({
      isOpen: true,
      defaultDayOfWeek: dayIndex + 1,
      defaultStartTime: time,
    });
  }, []);

  // Open create modal without pre-filled values
  const handleCreateManual = useCallback(() => {
    setCreateModalState({
      isOpen: true,
      defaultDayOfWeek: undefined,
      defaultStartTime: undefined,
    });
  }, []);

  // Handle clicking on a schedule slot
  const handleSlotClick = useCallback((slot: ScheduleSlot) => {
    setDetailModalState({
      isOpen: true,
      slot,
    });
  }, []);

  // Handle clicking "more" badge to see all overlapping schedules
  const handleMoreClick = useCallback((slots: ScheduleSlot[]) => {
    setListModalState({
      isOpen: true,
      slots,
    });
  }, []);

  // Handle selecting a slot from the list modal
  const handleSlotSelectFromList = useCallback((slot: ScheduleSlot) => {
    setDetailModalState({
      isOpen: true,
      slot,
    });
  }, []);

  // Handle schedule created/updated
  const handleScheduleChange = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <>
      <Card>
        <CardHeader>
          {/* Title and Create Button */}
          <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Schedule</CardTitle>
              <CardDescription>Weekly schedule view</CardDescription>
            </div>
            <Button variant="default" size="sm" onClick={handleCreateManual}>
              <Plus className="h-4 w-4 mr-1" />
              Create Schedule
            </Button>
          </div>

          {/* Filters and Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
            <ScheduleFilters
              selectedClass={selectedClass}
              selectedTeacher={selectedTeacher}
              onClassChange={setSelectedClass}
              onTeacherChange={setSelectedTeacher}
            />

            <ScheduleWeekNavigation
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              onNavigateWeek={handleNavigateWeek}
            />
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ScheduleGrid
              currentDate={currentDate}
              slots={slots}
              onCreateSlot={handleCreateSlot}
              onSlotClick={handleSlotClick}
              onMoreClick={handleMoreClick}
            />
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <CreateScheduleModal
        open={createModalState.isOpen}
        onOpenChange={(isOpen) => setCreateModalState(prev => ({ ...prev, isOpen }))}
        defaultDayOfWeek={createModalState.defaultDayOfWeek}
        defaultStartTime={createModalState.defaultStartTime}
        onScheduleCreated={handleScheduleChange}
      />

      <ScheduleDetailModal
        open={detailModalState.isOpen}
        onOpenChange={(isOpen) => setDetailModalState(prev => ({ ...prev, isOpen }))}
        slot={detailModalState.slot}
        onScheduleUpdated={handleScheduleChange}
      />

      <ScheduleListModal
        open={listModalState.isOpen}
        onOpenChange={(isOpen) => setListModalState(prev => ({ ...prev, isOpen }))}
        slots={listModalState.slots}
        onSlotSelect={handleSlotSelectFromList}
      />
    </>
  );
}
