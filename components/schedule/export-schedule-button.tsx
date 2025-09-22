'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download } from 'lucide-react';
import { getScheduleDataForExport } from '@/app/actions/export-actions';
import { useToast } from '@/components/ui/use-toast';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface ExportScheduleButtonProps {
  currentDate: Date;
}

export function ExportScheduleButton({ currentDate }: ExportScheduleButtonProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleExport = async (format: 'excel' | 'csv') => {
    setLoading(true);
    try {
      // Get schedule data
      const data = await getScheduleDataForExport(currentDate);
      
      // Format the data for export
      const formattedData = data.map(slot => ({
        'Day': getDayName(slot.dayOfWeek),
        'Start Time': slot.startTime,
        'End Time': slot.endTime,
        'Teacher': slot.teacherName,
        'Subject': slot.subjectName,
        'Class': slot.className,
        'Room': slot.roomName
      }));
      
      // Create workbook and worksheet
      const ws = XLSX.utils.json_to_sheet(formattedData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Schedule');
      
      // Export based on format
      if (format === 'excel') {
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const excelBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(excelBlob, 'schedule.xlsx');
      } else {
        const csv = XLSX.utils.sheet_to_csv(ws);
        const csvBlob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(csvBlob, 'schedule.csv');
      }
      
      toast({
        title: 'Success',
        description: `Schedule exported as ${format.toUpperCase()} successfully`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export schedule',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getDayName = (dayOfWeek: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek] || '';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={loading}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleExport('excel')}>
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}