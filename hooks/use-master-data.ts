'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { 
  getTeachers, 
  createTeacher, 
  updateTeacher, 
  deleteTeacher,
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  getClasses,
  createClass,
  updateClass,
  deleteClass,
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom
} from '@/app/actions/master-data-actions';
import { Teacher, Subject, Class, Room } from '@/types/master-data.types';

type EntityTypes = 'teachers' | 'subjects' | 'classes' | 'rooms';

// Define more specific input types for create and update operations
interface CreateTeacherData {
  name: string;
  employeeId?: string;
}

interface UpdateTeacherData {
  name?: string;
  employeeId?: string;
}

interface CreateSubjectData {
  name: string;
  code?: string;
  description?: string;
}

interface UpdateSubjectData {
  name?: string;
  code?: string;
  description?: string;
}

interface CreateClassData {
  name: string;
  grade?: number;
  academicYear?: string;
}

interface UpdateClassData {
  name?: string;
  grade?: number;
  academicYear?: string;
}

interface CreateRoomData {
  name: string;
  capacity?: number;
  location?: string;
}

interface UpdateRoomData {
  name?: string;
  capacity?: number;
  location?: string;
}

type CreateData<T> = T extends Teacher ? CreateTeacherData : 
                    T extends Subject ? CreateSubjectData :
                    T extends Class ? CreateClassData :
                    T extends Room ? CreateRoomData : never;

type UpdateData<T> = T extends Teacher ? UpdateTeacherData :
                    T extends Subject ? UpdateSubjectData :
                    T extends Class ? UpdateClassData :
                    T extends Room ? UpdateRoomData : never;

interface UseMasterDataReturn<T> {
  items: T[];
  loading: boolean;
  loadData: () => Promise<void>;
  createItem: (data: CreateData<T>) => Promise<T>;
  updateItem: (id: string, data: UpdateData<T>) => Promise<T>;
  deleteItem: (id: string, itemName: string) => Promise<void>;
  formValues: Record<string, unknown>;
  setFormValues: (values: Record<string, unknown>) => void;
  editingItem: T | null;
  setEditingItem: (item: T | null) => void;
}

// Custom hook for handling confirmation before deletion
export function useConfirmDelete() {
  
  const confirmDelete = (itemName: string, entityType: string, onDelete: () => void) => {
    // Using a simple confirmation for now; in a real app, you might want a more sophisticated confirmation dialog
    if (confirm(`Are you sure you want to delete ${itemName}? This action cannot be undone.`)) {
      onDelete();
    }
  };
  
  return { confirmDelete };
}

export function useMasterData<T extends Teacher | Subject | Class | Room>(
  entityType: EntityTypes
): UseMasterDataReturn<T> {
  const { toast } = useToast();
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [editingItem, setEditingItem] = useState<T | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      let data: T[] = [];
      
      switch (entityType) {
        case 'teachers':
          data = (await getTeachers()) as T[];
          break;
        case 'subjects':
          data = (await getSubjects()) as T[];
          break;
        case 'classes':
          data = (await getClasses()) as T[];
          break;
        case 'rooms':
          data = (await getRooms()) as T[];
          break;
      }
      
      setItems(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`Failed to load ${entityType}: ${errorMessage}`)
    } finally {
      setLoading(false);
    }
  }, [entityType, toast]);

  // Update useEffect to only reload when the specific tab is active
  useEffect(() => {
    let isMounted = true;
    
    const executeLoadData = async () => {
      try {
        if (isMounted) {
          setLoading(true);
        }
        let data: T[] = [];
        
        switch (entityType) {
          case 'teachers':
            data = (await getTeachers()) as T[];
            break;
          case 'subjects':
            data = (await getSubjects()) as T[];
            break;
          case 'classes':
            data = (await getClasses()) as T[];
            break;
          case 'rooms':
            data = (await getRooms()) as T[];
            break;
        }
        
        if (isMounted) {
          setItems(data);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        toast.error(`Failed to load ${entityType}: ${errorMessage}`);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    executeLoadData();

    return () => {
      isMounted = false;
    };
  }, [entityType, toast]);

  const createItem = useCallback(async (data: CreateData<T>) => {
    toast('Creating...', {
      description: `Creating new ${entityType.slice(0, -1)}...`,
    });
    
    try {
      let newItem: T;
      switch (entityType) {
        case 'teachers':
          newItem = await createTeacher(data as CreateTeacherData) as T;
          break;
        case 'subjects':
          newItem = await createSubject(data as CreateSubjectData) as T;
          break;
        case 'classes':
          newItem = await createClass(data as CreateClassData) as T;
          break;
        case 'rooms':
          newItem = await createRoom(data as CreateRoomData) as T;
          break;
        default:
          throw new Error(`Unknown entity type: ${entityType}`);
      }
      setItems(prevItems => [...prevItems, newItem]);
      
      toast.success(`${entityType.slice(0, 1).toUpperCase() + entityType.slice(1, -1)} created successfully`);
      return newItem;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`Failed to create ${entityType.slice(0, 1).toUpperCase() + entityType.slice(1, -1)}: ${errorMessage}`);
      throw error;
    }
  }, [entityType, toast]);

  const updateItem = useCallback(async (id: string, data: UpdateData<T>) => {
    if (!editingItem) {
      throw new Error('No item is currently being edited');
    }
    
    toast('Updating...', {
      description: `Updating ${entityType.slice(0, -1)}...`,
    });
    
    try {
      let updatedItem: T;
      switch (entityType) {
        case 'teachers':
          updatedItem = await updateTeacher(id, data as UpdateTeacherData) as T;
          break;
        case 'subjects':
          updatedItem = await updateSubject(id, data as UpdateSubjectData) as T;
          break;
        case 'classes':
          updatedItem = await updateClass(id, data as UpdateClassData) as T;
          break;
        case 'rooms':
          updatedItem = await updateRoom(id, data as UpdateRoomData) as T;
          break;
        default:
          throw new Error(`Unknown entity type: ${entityType}`);
      }
      setItems(prevItems => prevItems.map(item => item.id === id ? updatedItem : item));
      setEditingItem(null);
      
      toast.success(`${entityType.slice(0, 1).toUpperCase() + entityType.slice(1, -1)} updated successfully`);
      return updatedItem;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`Failed to update ${entityType.slice(0, 1).toUpperCase() + entityType.slice(1, -1)}: ${errorMessage}`);
      throw error;
    }
  }, [editingItem, entityType, toast]);

  const deleteItem = useCallback(async (id: string, itemName: string = 'item') => {
    toast('Deleting...', {
      description: `Deleting ${itemName}...`,
    });
    
    try {
      switch (entityType) {
        case 'teachers':
          await deleteTeacher(id);
          break;
        case 'subjects':
          await deleteSubject(id);
          break;
        case 'classes':
          await deleteClass(id);
          break;
        case 'rooms':
          await deleteRoom(id);
          break;
        default:
          throw new Error(`Unknown entity type: ${entityType}`);
      }
      setItems(prevItems => prevItems.filter(item => item.id !== id));
      
      toast.success(`${entityType.slice(0, 1).toUpperCase() + entityType.slice(1, -1)} deleted successfully`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`Failed to delete ${entityType.slice(0, 1).toUpperCase() + entityType.slice(1, -1)}: ${errorMessage}`);
      throw error;
    }
  }, [entityType, toast]);

  return {
    items,
    loading,
    loadData,
    createItem,
    updateItem,
    deleteItem: deleteItem,
    formValues,
    setFormValues,
    editingItem,
    setEditingItem,
  };
}