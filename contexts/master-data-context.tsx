'use client';

import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
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

// Define specific types for create operations
interface CreateTeacherData {
  name: string;
  employeeId?: string;
}

interface CreateSubjectData {
  name: string;
  code?: string;
  description?: string;
}

interface CreateClassData {
  name: string;
  grade?: number;
  academicYear?: string;
}

interface CreateRoomData {
  name: string;
  capacity?: number;
  location?: string;
}

// Define specific types for update operations
type UpdateTeacherData = Partial<Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'>>;
type UpdateSubjectData = Partial<Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>>;
type UpdateClassData = Partial<Omit<Class, 'id' | 'createdAt' | 'updatedAt'>>;
type UpdateRoomData = Partial<Omit<Room, 'id' | 'createdAt' | 'updatedAt'>>;

interface MasterDataContextType {
  teachers: Teacher[];
  subjects: Subject[];
  classes: Class[];
  rooms: Room[];
  loading: Record<EntityTypes, boolean>;
  editingItem: Teacher | Subject | Class | Room | null;
  setEditingItem: (item: Teacher | Subject | Class | Room | null) => void;
  formValues: Record<string, unknown>;
  setFormValues: (values: Record<string, unknown>) => void;
  refreshData: (entityType: EntityTypes) => Promise<void>;
  createItem: (entityType: EntityTypes, data: CreateTeacherData | CreateSubjectData | CreateClassData | CreateRoomData) => Promise<Teacher | Subject | Class | Room>;
  updateItem: (entityType: EntityTypes, id: string, data: UpdateTeacherData | UpdateSubjectData | UpdateClassData | UpdateRoomData) => Promise<Teacher | Subject | Class | Room>;
  deleteItem: (entityType: EntityTypes, id: string, itemName: string) => Promise<void>;
}

const MasterDataContext = createContext<MasterDataContextType | undefined>(undefined);

export function MasterDataProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<Record<EntityTypes, boolean>>({
    teachers: true,
    subjects: true, 
    classes: true,
    rooms: true
  });
  const [editingItem, setEditingItem] = useState<Teacher | Subject | Class | Room | null>(null);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});

  const loadData = useCallback(async (entityType: EntityTypes) => {
    setLoading(prev => ({ ...prev, [entityType]: true }));
    try {
      switch (entityType) {
        case 'teachers':
          const teachersData = await getTeachers();
          setTeachers(teachersData);
          break;
        case 'subjects':
          const subjectsData = await getSubjects();
          setSubjects(subjectsData);
          break;
        case 'classes':
          const classesData = await getClasses();
          setClasses(classesData);
          break;
        case 'rooms':
          const roomsData = await getRooms();
          setRooms(roomsData);
          break;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`Failed to load ${entityType}: ${errorMessage}`);
    } finally {
      setLoading(prev => ({ ...prev, [entityType]: false }));
    }
  }, [toast]);

  // Load all data on initial render
  useEffect(() => {
    const loadAllData = async () => {
      await Promise.all([
        loadData('teachers'),
        loadData('subjects'),
        loadData('classes'),
        loadData('rooms')
      ]);
    };
    
    loadAllData();
  }, [loadData]);

  const refreshData = useCallback(async (entityType: EntityTypes) => {
    await loadData(entityType);
  }, [loadData]);

  const createItem = useCallback(async (entityType: EntityTypes, data: CreateTeacherData | CreateSubjectData | CreateClassData | CreateRoomData) => {
    toast('Creating...',{
      description: `Creating new ${entityType.slice(0, -1)}...`,
    });
    
    try {
      let newItem: Teacher | Subject | Class | Room;
      switch (entityType) {
        case 'teachers':
          newItem = await createTeacher(data as CreateTeacherData);
          setTeachers(prev => [...prev, newItem as Teacher]);
          break;
        case 'subjects':
          newItem = await createSubject(data as CreateSubjectData);
          setSubjects(prev => [...prev, newItem as Subject]);
          break;
        case 'classes':
          newItem = await createClass(data as CreateClassData);
          setClasses(prev => [...prev, newItem as Class]);
          break;
        case 'rooms':
          newItem = await createRoom(data as CreateRoomData);
          setRooms(prev => [...prev, newItem as Room]);
          break;
        default:
          throw new Error(`Unknown entity type: ${entityType}`);
      }
      
      toast.success(`${entityType.slice(0, 1).toUpperCase() + entityType.slice(1, -1)} created successfully`);
      return newItem;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`Failed to create ${entityType.slice(0, 1).toUpperCase() + entityType.slice(1, -1)}: ${errorMessage}`);
      throw error;
    }
  }, [toast]);

  const updateItem = useCallback(async (entityType: EntityTypes, id: string, data: UpdateTeacherData | UpdateSubjectData | UpdateClassData | UpdateRoomData) => {
    toast('Updating...',{
      description: `Updating ${entityType.slice(0, -1)}...`,
    });
    
    try {
      let updatedItem: Teacher | Subject | Class | Room;
      switch (entityType) {
        case 'teachers':
          updatedItem = await updateTeacher(id, data as UpdateTeacherData);
          setTeachers(prev => prev.map(item => item.id === id ? updatedItem as Teacher : item));
          break;
        case 'subjects':
          updatedItem = await updateSubject(id, data as UpdateSubjectData);
          setSubjects(prev => prev.map(item => item.id === id ? updatedItem as Subject : item));
          break;
        case 'classes':
          updatedItem = await updateClass(id, data as UpdateClassData);
          setClasses(prev => prev.map(item => item.id === id ? updatedItem as Class : item));
          break;
        case 'rooms':
          updatedItem = await updateRoom(id, data as UpdateRoomData);
          setRooms(prev => prev.map(item => item.id === id ? updatedItem as Room : item));
          break;
        default:
          throw new Error(`Unknown entity type: ${entityType}`);
      }
      
      toast.success(`${entityType.slice(0, 1).toUpperCase() + entityType.slice(1, -1)} updated successfully`);
      return updatedItem;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`Failed to update ${entityType.slice(0, 1).toUpperCase() + entityType.slice(1, -1)}: ${errorMessage}`);
      throw error;
    }
  }, [toast]);

  const deleteItem = useCallback(async (entityType: EntityTypes, id: string, itemName: string) => {
    toast('Deleting...',{
      description: `Deleting ${itemName}...`,
    });
    
    try {
      switch (entityType) {
        case 'teachers':
          await deleteTeacher(id);
          setTeachers(prev => prev.filter(item => item.id !== id));
          break;
        case 'subjects':
          await deleteSubject(id);
          setSubjects(prev => prev.filter(item => item.id !== id));
          break;
        case 'classes':
          await deleteClass(id);
          setClasses(prev => prev.filter(item => item.id !== id));
          break;
        case 'rooms':
          await deleteRoom(id);
          setRooms(prev => prev.filter(item => item.id !== id));
          break;
        default:
          throw new Error(`Unknown entity type: ${entityType}`);
      }
      
      toast.success(`${entityType.slice(0, 1).toUpperCase() + entityType.slice(1, -1)} deleted successfully`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`Failed to delete ${entityType.slice(0, 1).toUpperCase() + entityType.slice(1, -1)}: ${errorMessage}`);
      throw error;
    }
  }, [toast]);

  return (
    <MasterDataContext.Provider
      value={{
        teachers,
        subjects,
        classes,
        rooms,
        loading,
        editingItem,
        setEditingItem,
        formValues,
        setFormValues,
        refreshData,
        createItem,
        updateItem,
        deleteItem,
      }}
    >
      {children}
    </MasterDataContext.Provider>
  );
}

// Function overloads for proper typing
export function useMasterData(entityType: 'teachers'): {
  items: Teacher[];
  loading: boolean;
  editingItem: Teacher | null;
  setEditingItem: (item: Teacher | null) => void;
  formValues: Record<string, unknown>;
  setFormValues: (values: Record<string, unknown>) => void;
  refreshData: () => Promise<void>;
  createItem: (data: CreateTeacherData) => Promise<Teacher>;
  updateItem: (id: string, data: UpdateTeacherData) => Promise<Teacher>;
  deleteItem: (id: string, itemName: string) => Promise<void>;
};

export function useMasterData(entityType: 'subjects'): {
  items: Subject[];
  loading: boolean;
  editingItem: Subject | null;
  setEditingItem: (item: Subject | null) => void;
  formValues: Record<string, unknown>;
  setFormValues: (values: Record<string, unknown>) => void;
  refreshData: () => Promise<void>;
  createItem: (data: CreateSubjectData) => Promise<Subject>;
  updateItem: (id: string, data: UpdateSubjectData) => Promise<Subject>;
  deleteItem: (id: string, itemName: string) => Promise<void>;
};

export function useMasterData(entityType: 'classes'): {
  items: Class[];
  loading: boolean;
  editingItem: Class | null;
  setEditingItem: (item: Class | null) => void;
  formValues: Record<string, unknown>;
  setFormValues: (values: Record<string, unknown>) => void;
  refreshData: () => Promise<void>;
  createItem: (data: CreateClassData) => Promise<Class>;
  updateItem: (id: string, data: UpdateClassData) => Promise<Class>;
  deleteItem: (id: string, itemName: string) => Promise<void>;
};

export function useMasterData(entityType: 'rooms'): {
  items: Room[];
  loading: boolean;
  editingItem: Room | null;
  setEditingItem: (item: Room | null) => void;
  formValues: Record<string, unknown>;
  setFormValues: (values: Record<string, unknown>) => void;
  refreshData: () => Promise<void>;
  createItem: (data: CreateRoomData) => Promise<Room>;
  updateItem: (id: string, data: UpdateRoomData) => Promise<Room>;
  deleteItem: (id: string, itemName: string) => Promise<void>;
};

export function useMasterData(entityType: EntityTypes) {
  const context = useContext(MasterDataContext);
  if (context === undefined) {
    throw new Error('useMasterData must be used within a MasterDataProvider');
  }
  
  const { 
    teachers, 
    subjects, 
    classes, 
    rooms, 
    loading, 
    createItem, 
    updateItem, 
    deleteItem,
    refreshData,
    editingItem,
    setEditingItem,
    formValues,
    setFormValues
  } = context;

  // Return data and functions based on the entity type
  switch (entityType) {
    case 'teachers':
      return {
        items: teachers,
        loading: loading[entityType],
        editingItem: editingItem as Teacher | null,
        setEditingItem: setEditingItem as (item: Teacher | null) => void,
        formValues,
        setFormValues,
        refreshData: () => refreshData(entityType),
        createItem: (data: CreateTeacherData) => createItem(entityType, data),
        updateItem: (id: string, data: UpdateTeacherData) => updateItem(entityType, id, data),
        deleteItem: (id: string, itemName: string) => deleteItem(entityType, id, itemName),
      };
    case 'subjects':
      return {
        items: subjects,
        loading: loading[entityType],
        editingItem: editingItem as Subject | null,
        setEditingItem: setEditingItem as (item: Subject | null) => void,
        formValues,
        setFormValues,
        refreshData: () => refreshData(entityType),
        createItem: (data: CreateSubjectData) => createItem(entityType, data),
        updateItem: (id: string, data: UpdateSubjectData) => updateItem(entityType, id, data),
        deleteItem: (id: string, itemName: string) => deleteItem(entityType, id, itemName),
      };
    case 'classes':
      return {
        items: classes,
        loading: loading[entityType],
        editingItem: editingItem as Class | null,
        setEditingItem: setEditingItem as (item: Class | null) => void,
        formValues,
        setFormValues,
        refreshData: () => refreshData(entityType),
        createItem: (data: CreateClassData) => createItem(entityType, data),
        updateItem: (id: string, data: UpdateClassData) => updateItem(entityType, id, data),
        deleteItem: (id: string, itemName: string) => deleteItem(entityType, id, itemName),
      };
    case 'rooms':
      return {
        items: rooms,
        loading: loading[entityType],
        editingItem: editingItem as Room | null,
        setEditingItem: setEditingItem as (item: Room | null) => void,
        formValues,
        setFormValues,
        refreshData: () => refreshData(entityType),
        createItem: (data: CreateRoomData) => createItem(entityType, data),
        updateItem: (id: string, data: UpdateRoomData) => updateItem(entityType, id, data),
        deleteItem: (id: string, itemName: string) => deleteItem(entityType, id, itemName),
      };
    default:
      throw new Error(`Unknown entity type: ${entityType}`);
  }
}