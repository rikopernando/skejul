'use client';

import { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import {
  getClasses,
  createClass,
  updateClass,
  deleteClass
} from '@/app/actions/master-data-actions';
import { Class } from '@/types/master-data.types';

interface CreateClassData {
  name: string;
  grade?: number;
  academicYear?: string;
}

type UpdateClassData = Partial<Omit<Class, 'id' | 'createdAt' | 'updatedAt'>>;

interface ClassesContextType {
  classes: Class[];
  loading: boolean;
  editingClass: Class | null;
  setEditingClass: (classItem: Class | null) => void;
  formValues: Record<string, unknown>;
  setFormValues: (values: Record<string, unknown>) => void;
  loadClasses: () => Promise<void>;
  createClass: (data: CreateClassData) => Promise<Class>;
  updateClass: (id: string, data: UpdateClassData) => Promise<Class>;
  deleteClass: (id: string, name: string) => Promise<void>;
}

const ClassesContext = createContext<ClassesContextType | undefined>(undefined);

export function ClassesProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});

  const loadClasses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getClasses();
      setClasses(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`Failed to load classes: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleCreateClass = useCallback(async (data: CreateClassData) => {
    const toastId = toast.loading('Creating new class...');

    try {
      const newClass = await createClass(data);
      setClasses(prev => [...prev, newClass]);

      toast.success('Class created successfully', { id: toastId });

      return newClass;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`Failed to create class: ${errorMessage}`, { id: toastId });
      throw error;
    }
  }, [toast]);

  const handleUpdateClass = useCallback(async (id: string, data: UpdateClassData) => {
    const toastId = toast.loading('Updating class...');

    try {
      const updatedClass = await updateClass(id, data);
      setClasses(prev => prev.map(classItem => classItem.id === id ? updatedClass : classItem));

      toast.success('Class updated successfully', { id: toastId });

      return updatedClass;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`Failed to update class: ${errorMessage}`, { id: toastId });
      throw error;
    }
  }, [toast]);

  const handleDeleteClass = useCallback(async (id: string, name: string) => {
    const toastId = toast.loading(`Deleting ${name}...`);

    try {
      await deleteClass(id);
      setClasses(prev => prev.filter(classItem => classItem.id !== id));

      toast.success('Class deleted successfully', { id: toastId });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`Failed to delete class: ${errorMessage}`, { id: toastId });
      throw error;
    }
  }, [toast]);

  return (
    <ClassesContext.Provider
      value={{
        classes,
        loading,
        editingClass,
        setEditingClass,
        formValues,
        setFormValues,
        loadClasses,
        createClass: handleCreateClass,
        updateClass: handleUpdateClass,
        deleteClass: handleDeleteClass,
      }}
    >
      {children}
    </ClassesContext.Provider>
  );
}

export function useClasses() {
  const context = useContext(ClassesContext);
  if (context === undefined) {
    throw new Error('useClasses must be used within a ClassesProvider');
  }
  return context;
}
