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
import { useRooms } from '@/contexts/rooms-context';

export function RoomForm() {
  const {
    formValues,
    setFormValues,
    editingRoom,
    setEditingRoom,
    createRoom,
    updateRoom,
  } = useRooms();

  const [open, setOpen] = useState(false);

  // Open dialog when editingRoom is set
  useEffect(() => {
    if (editingRoom) {
      setOpen(true);
    }
  }, [editingRoom]);

  const handleOpen = () => {
    setOpen(true);
    setEditingRoom(null);
    setFormValues({ name: '', capacity: '', location: '' });
  };

  const handleClose = () => {
    setOpen(false);
    setEditingRoom(null);
    setFormValues({ name: '', capacity: '', location: '' });
  };

  const handleSubmit = async () => {
    try {
      if (editingRoom) {
        await updateRoom(editingRoom.id, {
          name: typeof formValues.name === 'string' ? formValues.name : '',
          capacity: typeof formValues.capacity === 'string' && formValues.capacity ? parseInt(formValues.capacity) : undefined,
          location: typeof formValues.location === 'string' ? formValues.location : undefined
        });
      } else {
        await createRoom({
          name: typeof formValues.name === 'string' ? formValues.name : '',
          capacity: typeof formValues.capacity === 'string' && formValues.capacity ? parseInt(formValues.capacity) : undefined,
          location: typeof formValues.location === 'string' ? formValues.location : undefined
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
        Add Room
      </Button>

      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingRoom ? 'Edit Room' : 'Add Room'}
            </DialogTitle>
            <DialogDescription>
              {editingRoom 
                ? 'Edit the room details below' 
                : 'Enter the details for the new room'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="room-name">Name</Label>
              <Input
                id="room-name"
                value={typeof formValues.name === 'string' ? formValues.name : ''}
                onChange={(e) => setFormValues({...formValues, name: e.target.value})}
                placeholder="Enter room name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="room-capacity">Capacity</Label>
              <Input
                id="room-capacity"
                type="number"
                value={typeof formValues.capacity === 'string' ? formValues.capacity : ''}
                onChange={(e) => setFormValues({...formValues, capacity: e.target.value})}
                placeholder="Enter capacity (optional)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="room-location">Location</Label>
              <Input
                id="room-location"
                value={typeof formValues.location === 'string' ? formValues.location : ''}
                onChange={(e) => setFormValues({...formValues, location: e.target.value})}
                placeholder="Enter location (optional)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleSubmit}
              disabled={!formValues.name}
            >
              {editingRoom ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}