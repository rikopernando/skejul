'use client';

import { useState } from 'react';
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
import { useMasterData } from '@/hooks/use-master-data';
import { Class } from '@/types/master-data.types';


export function ClassForm() {
  const {
    formValues,
    setFormValues,
    editingItem,
    setEditingItem,
    createItem,
    updateItem,
  } = useMasterData<Class>('classes');
  
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    setEditingItem(null);
    setFormValues({ name: '', grade: '', academicYear: '' });
  };

  const handleSubmit = async () => {
    try {
      if (editingItem) {
        await updateItem(editingItem.id, {
          name: typeof formValues.name === 'string' ? formValues.name : '',
          grade: typeof formValues.grade === 'string' && formValues.grade ? parseInt(formValues.grade) : undefined,
          academicYear: typeof formValues.academicYear === 'string' ? formValues.academicYear : undefined
        });
      } else {
        await createItem({
          name: typeof formValues.name === 'string' ? formValues.name : '',
          grade: typeof formValues.grade === 'string' && formValues.grade ? parseInt(formValues.grade) : undefined,
          academicYear: typeof formValues.academicYear === 'string' ? formValues.academicYear : undefined
        });
      }
      setOpen(false);
    } catch (error) {
      // Error is handled in the hook
    }
  };



  return (
    <>
      <Button onClick={handleOpen}>
        <Plus className="mr-2 h-4 w-4" />
        Add Class
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Class' : 'Add Class'}
            </DialogTitle>
            <DialogDescription>
              {editingItem 
                ? 'Edit the class details below' 
                : 'Enter the details for the new class'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="class-name">Name</Label>
              <Input
                id="class-name"
                value={typeof formValues.name === 'string' ? formValues.name : ''}
                onChange={(e) => setFormValues({...formValues, name: e.target.value})}
                placeholder="Enter class name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class-grade">Grade</Label>
              <Input
                id="class-grade"
                type="number"
                value={typeof formValues.grade === 'string' ? formValues.grade : ''}
                onChange={(e) => setFormValues({...formValues, grade: e.target.value})}
                placeholder="Enter grade (optional)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class-academic-year">Academic Year</Label>
              <Input
                id="class-academic-year"
                value={typeof formValues.academicYear === 'string' ? formValues.academicYear : ''}
                onChange={(e) => setFormValues({...formValues, academicYear: e.target.value})}
                placeholder="Enter academic year (optional)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleSubmit}
              disabled={!formValues.name}
            >
              {editingItem ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}