'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit, Trash2 } from 'lucide-react';
import { useMasterData } from '@/contexts/master-data-context';
import { Room } from '@/types/master-data.types';

export function RoomTable() {
  const {
    items: rooms,
    loading,
    loadData,
    setEditingItem,
    setFormValues,
    deleteItem,
  } = useMasterData('rooms');

  // Load data when component mounts
  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleEdit = (room: Room) => {
    setEditingItem(room);
    setFormValues({
      name: room.name,
      capacity: room.capacity?.toString() || '',
      location: room.location || ''
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
                onClick={() => deleteItem(room.id, room.name)}
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