'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useTeachers } from '@/contexts/teachers-context';

export function TeacherForm() {
  const {
    formValues,
    setFormValues,
    editingTeacher,
    setEditingTeacher,
    createTeacher,
    updateTeacher,
  } = useTeachers();

  const [open, setOpen] = useState(false);

  // Open dialog when editingTeacher is set
  useEffect(() => {
    if (editingTeacher) {
      setOpen(true);
    }
  }, [editingTeacher]);

  const handleOpen = () => {
    setOpen(true);
    setEditingTeacher(null);
    setFormValues({ name: '', employeeId: '' });
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTeacher(null);
    setFormValues({ name: '', employeeId: '' });
  };

  const handleSubmit = async () => {
    try {
      if (editingTeacher) {
        await updateTeacher(editingTeacher.id, {
          name: typeof formValues.name === 'string' ? formValues.name : '',
          employeeId: typeof formValues.employeeId === 'string' ? formValues.employeeId : undefined
        });
      } else {
        await createTeacher({
          name: typeof formValues.name === 'string' ? formValues.name : '',
          employeeId: typeof formValues.employeeId === 'string' ? formValues.employeeId : undefined
        });
      }
      handleClose();
    } catch (error) {
      // Error is handled in the hook
    }
  };

  return (
    <>
      <Button onClick={handleOpen}>
        <Plus className="mr-2 h-4 w-4" />
        Add Teacher
      </Button>

      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTeacher ? 'Edit Teacher' : 'Add Teacher'}
            </DialogTitle>
            <DialogDescription>
              {editingTeacher
                ? 'Edit the teacher details below'
                : 'Enter the details for the new teacher'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="teacher-name">Name</Label>
              <Input
                id="teacher-name"
                value={typeof formValues.name === 'string' ? formValues.name : ''}
                onChange={(e) => setFormValues({...formValues, name: e.target.value})}
                placeholder="Enter teacher name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teacher-employee-id">Employee ID</Label>
              <Input
                id="teacher-employee-id"
                value={typeof formValues.employeeId === 'string' ? formValues.employeeId : ''}
                onChange={(e) => setFormValues({...formValues, employeeId: e.target.value})}
                placeholder="Enter employee ID (optional)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleSubmit}
              disabled={!formValues.name}
            >
              {editingTeacher ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}