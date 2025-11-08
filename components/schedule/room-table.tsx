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
import { useRooms } from '@/contexts/rooms-context';
import { Room } from '@/types/master-data.types';

export function RoomTable() {
  const {
    rooms,
    loading,
    loadRooms,
    setEditingRoom,
    setFormValues,
    deleteRoom,
  } = useRooms();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);

  // Load data when component mounts
  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setFormValues({
      name: room.name,
      capacity: room.capacity?.toString() || '',
      location: room.location || ''
    });
  };

  const handleDeleteClick = (room: Room) => {
    setRoomToDelete(room);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (roomToDelete) {
      await deleteRoom(roomToDelete.id, roomToDelete.name);
      setDeleteDialogOpen(false);
      setRoomToDelete(null);
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
          <TableHead>Capacity</TableHead>
          <TableHead>Location</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rooms.map((room) => (
          <TableRow key={room.id}>
            <TableCell>{room.name}</TableCell>
            <TableCell>{room.capacity || '-'}</TableCell>
            <TableCell>{room.location || '-'}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(room)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteClick(room)}
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
              This will permanently delete the room{' '}
              <span className="font-semibold">{roomToDelete?.name}</span>.
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