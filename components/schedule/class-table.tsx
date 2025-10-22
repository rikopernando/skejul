'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit, Trash2 } from 'lucide-react';
import { useMasterData } from '@/contexts/master-data-context';
import { Class } from '@/types/master-data.types';

export function ClassTable() {
  const {
    items: classes,
    loading,
    loadData,
    setEditingItem,
    setFormValues,
    deleteItem,
  } = useMasterData('classes');

  // Load data when component mounts
  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleEdit = (classItem: Class) => {
    setEditingItem(classItem);
    setFormValues({
      name: classItem.name,
      grade: classItem.grade?.toString() || '',
      academicYear: classItem.academicYear || ''
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
          <TableHead>Grade</TableHead>
          <TableHead>Academic Year</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {classes.map((classItem) => (
          <TableRow key={classItem.id}>
            <TableCell>{classItem.name}</TableCell>
            <TableCell>{classItem.grade || '-'}</TableCell>
            <TableCell>{classItem.academicYear || '-'}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(classItem)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteItem(classItem.id, classItem.name)}
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