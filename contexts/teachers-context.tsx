'use client';

import { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import {
  getTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher
} from '@/app/actions/master-data-actions';
import { Teacher } from '@/types/master-data.types';

interface CreateTeacherData {
  name: string;
  employeeId?: string;
}

type UpdateTeacherData = Partial<Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'>>;

interface TeachersContextType {
  teachers: Teacher[];
  loading: boolean;
  editingTeacher: Teacher | null;
  setEditingTeacher: (teacher: Teacher | null) => void;
  formValues: Record<string, unknown>;
  setFormValues: (values: Record<string, unknown>) => void;
  loadTeachers: () => Promise<void>;
  createTeacher: (data: CreateTeacherData) => Promise<Teacher>;
  updateTeacher: (id: string, data: UpdateTeacherData) => Promise<Teacher>;
  deleteTeacher: (id: string, name: string) => Promise<void>;
}

const TeachersContext = createContext<TeachersContextType | undefined>(undefined);

export function TeachersProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});

  const loadTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTeachers();
      setTeachers(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`Failed to load teachers: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleCreateTeacher = useCallback(async (data: CreateTeacherData) => {
    const toastId = toast.loading('Creating new teacher...');

    try {
      const newTeacher = await createTeacher(data);
      setTeachers(prev => [...prev, newTeacher]);

      toast.success('Teacher created successfully', { id: toastId });

      return newTeacher;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`Failed to create teacher: ${errorMessage}`, { id: toastId });
      throw error;
    }
  }, [toast]);

  const handleUpdateTeacher = useCallback(async (id: string, data: UpdateTeacherData) => {
    const toastId = toast.loading('Updating teacher...');

    try {
      const updatedTeacher = await updateTeacher(id, data);
      setTeachers(prev => prev.map(teacher => teacher.id === id ? updatedTeacher : teacher));

      toast.success('Teacher updated successfully', { id: toastId });

      return updatedTeacher;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`Failed to update teacher: ${errorMessage}`, { id: toastId });
      throw error;
    }
  }, [toast]);

  const handleDeleteTeacher = useCallback(async (id: string, name: string) => {
    const toastId = toast.loading(`Deleting ${name}...`);

    try {
      await deleteTeacher(id);
      setTeachers(prev => prev.filter(teacher => teacher.id !== id));

      toast.success('Teacher deleted successfully', { id: toastId });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`Failed to delete teacher: ${errorMessage}`, { id: toastId });
      throw error;
    }
  }, [toast]);

  return (
    <TeachersContext.Provider
      value={{
        teachers,
        loading,
        editingTeacher,
        setEditingTeacher,
        formValues,
        setFormValues,
        loadTeachers,
        createTeacher: handleCreateTeacher,
        updateTeacher: handleUpdateTeacher,
        deleteTeacher: handleDeleteTeacher,
      }}
    >
      {children}
    </TeachersContext.Provider>
  );
}

export function useTeachers() {
  const context = useContext(TeachersContext);
  if (context === undefined) {
    throw new Error('useTeachers must be used within a TeachersProvider');
  }
  return context;
}
