'use client';

import { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom
} from '@/app/actions/master-data-actions';
import { Room } from '@/types/master-data.types';

interface CreateRoomData {
  name: string;
  capacity?: number;
  location?: string;
}

type UpdateRoomData = Partial<Omit<Room, 'id' | 'createdAt' | 'updatedAt'>>;

interface RoomsContextType {
  rooms: Room[];
  loading: boolean;
  editingRoom: Room | null;
  setEditingRoom: (room: Room | null) => void;
  formValues: Record<string, unknown>;
  setFormValues: (values: Record<string, unknown>) => void;
  loadRooms: () => Promise<void>;
  createRoom: (data: CreateRoomData) => Promise<Room>;
  updateRoom: (id: string, data: UpdateRoomData) => Promise<Room>;
  deleteRoom: (id: string, name: string) => Promise<void>;
}

const RoomsContext = createContext<RoomsContextType | undefined>(undefined);

export function RoomsProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});

  const loadRooms = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRooms();
      setRooms(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`Failed to load rooms: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleCreateRoom = useCallback(async (data: CreateRoomData) => {
    const toastId = toast.loading('Creating new room...');

    try {
      const newRoom = await createRoom(data);
      setRooms(prev => [...prev, newRoom]);

      toast.success('Room created successfully', { id: toastId });

      return newRoom;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`Failed to create room: ${errorMessage}`, { id: toastId });
      throw error;
    }
  }, [toast]);

  const handleUpdateRoom = useCallback(async (id: string, data: UpdateRoomData) => {
    const toastId = toast.loading('Updating room...');

    try {
      const updatedRoom = await updateRoom(id, data);
      setRooms(prev => prev.map(room => room.id === id ? updatedRoom : room));

      toast.success('Room updated successfully', { id: toastId });

      return updatedRoom;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`Failed to update room: ${errorMessage}`, { id: toastId });
      throw error;
    }
  }, [toast]);

  const handleDeleteRoom = useCallback(async (id: string, name: string) => {
    const toastId = toast.loading(`Deleting ${name}...`);

    try {
      await deleteRoom(id);
      setRooms(prev => prev.filter(room => room.id !== id));

      toast.success('Room deleted successfully', { id: toastId });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`Failed to delete room: ${errorMessage}`, { id: toastId });
      throw error;
    }
  }, [toast]);

  return (
    <RoomsContext.Provider
      value={{
        rooms,
        loading,
        editingRoom,
        setEditingRoom,
        formValues,
        setFormValues,
        loadRooms,
        createRoom: handleCreateRoom,
        updateRoom: handleUpdateRoom,
        deleteRoom: handleDeleteRoom,
      }}
    >
      {children}
    </RoomsContext.Provider>
  );
}

export function useRooms() {
  const context = useContext(RoomsContext);
  if (context === undefined) {
    throw new Error('useRooms must be used within a RoomsProvider');
  }
  return context;
}
