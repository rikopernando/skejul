/**
 * ScheduleFilters component - Handles class and teacher filter controls
 */

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useClassData } from '@/hooks/use-class-data';
import { useTeacherData } from '@/hooks/use-teacher-data';

interface ScheduleFiltersProps {
  selectedClass: string;
  selectedTeacher: string;
  onClassChange: (value: string) => void;
  onTeacherChange: (value: string) => void;
}

export function ScheduleFilters({
  selectedClass,
  selectedTeacher,
  onClassChange,
  onTeacherChange,
}: ScheduleFiltersProps) {
  const { classes } = useClassData();
  const { teachers } = useTeacherData();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={selectedClass} onValueChange={onClassChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Filter by class" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Classes</SelectItem>
          {classes.map((cls) => (
            <SelectItem key={cls.id} value={cls.id}>
              {cls.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedTeacher} onValueChange={onTeacherChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Filter by teacher" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Teachers</SelectItem>
          {teachers.map((teacher) => (
            <SelectItem key={teacher.id} value={teacher.id}>
              {teacher.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
