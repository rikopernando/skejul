'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Edit, Trash2 } from 'lucide-react';
import { useClasses } from '@/contexts/classes-context';
import { Class } from '@/types/master-data.types';

export function ClassTable() {
  const {
    classes,
    loading,
    loadClasses,
    setEditingClass,
    setFormValues,
    deleteClass,
  } = useClasses();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<Class | null>(null);

  // Load data when component mounts
  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  const handleEdit = (classItem: Class) => {
    setEditingClass(classItem);
    setFormValues({
      name: classItem.name,
      grade: classItem.grade?.toString() || '',
      academicYear: classItem.academicYear || ''
    });
  };

  const handleDeleteClick = (classItem: Class) => {
    setClassToDelete(classItem);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (classToDelete) {
      await deleteClass(classToDelete.id, classToDelete.name);
      setDeleteDialogOpen(false);
      setClassToDelete(null);
    }
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
                onClick={() => handleDeleteClick(classItem)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the class{' '}
              <span className="font-semibold">{classToDelete?.name}</span>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Table>
  );
}