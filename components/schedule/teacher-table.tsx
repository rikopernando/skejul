'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit, Trash2 } from 'lucide-react';
import { useMasterData } from '@/contexts/master-data-context';
import { Teacher } from '@/types/master-data.types';

export function TeacherTable() {
  const {
    items: teachers,
    loading,
    loadData,
    setEditingItem,
    setFormValues,
    deleteItem,
  } = useMasterData('teachers');

  // Load data when component mounts
  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleEdit = (teacher: Teacher) => {
    setEditingItem(teacher);
    setFormValues({
      name: teacher.name,
      employeeId: teacher.employeeId || ''
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Employee ID</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {teachers.map((teacher) => (
          <TableRow key={teacher.id}>
            <TableCell>{teacher.name}</TableCell>
            <TableCell>{teacher.employeeId || '-'}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(teacher)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteItem(teacher.id, teacher.name)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}