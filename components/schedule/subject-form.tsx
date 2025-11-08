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
import { useSubjects } from '@/contexts/subjects-context';

export function SubjectForm() {
  const {
    formValues,
    setFormValues,
    editingSubject,
    setEditingSubject,
    createSubject,
    updateSubject,
  } = useSubjects();

  const [open, setOpen] = useState(false);

  // Open dialog when editingSubject is set
  useEffect(() => {
    if (editingSubject) {
      setOpen(true);
    }
  }, [editingSubject]);

  const handleOpen = () => {
    setOpen(true);
    setEditingSubject(null);
    setFormValues({ name: '', code: '', description: '' });
  };

  const handleClose = () => {
    setOpen(false);
    setEditingSubject(null);
    setFormValues({ name: '', code: '', description: '' });
  };

  const handleSubmit = async () => {
    try {
      if (editingSubject) {
        await updateSubject(editingSubject.id, {
          name: typeof formValues.name === 'string' ? formValues.name : '',
          code: typeof formValues.code === 'string' ? formValues.code : undefined,
          description: typeof formValues.description === 'string' ? formValues.description : undefined
        });
      } else {
        await createSubject({
          name: typeof formValues.name === 'string' ? formValues.name : '',
          code: typeof formValues.code === 'string' ? formValues.code : undefined,
          description: typeof formValues.description === 'string' ? formValues.description : undefined
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
        Add Subject
      </Button>

      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSubject ? 'Edit Subject' : 'Add Subject'}
            </DialogTitle>
            <DialogDescription>
              {editingSubject 
                ? 'Edit the subject details below' 
                : 'Enter the details for the new subject'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject-name">Name</Label>
              <Input
                id="subject-name"
                value={typeof formValues.name === 'string' ? formValues.name : ''}
                onChange={(e) => setFormValues({...formValues, name: e.target.value})}
                placeholder="Enter subject name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject-code">Code</Label>
              <Input
                id="subject-code"
                value={typeof formValues.code === 'string' ? formValues.code : ''}
                onChange={(e) => setFormValues({...formValues, code: e.target.value})}
                placeholder="Enter subject code (optional)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject-description">Description</Label>
              <Input
                id="subject-description"
                value={typeof formValues.description === 'string' ? formValues.description : ''}
                onChange={(e) => setFormValues({...formValues, description: e.target.value})}
                placeholder="Enter description (optional)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleSubmit}
              disabled={!formValues.name}
            >
              {editingSubject ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}