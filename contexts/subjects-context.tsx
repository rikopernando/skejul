'use client';

import { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject
} from '@/app/actions/master-data-actions';
import { Subject } from '@/types/master-data.types';

interface CreateSubjectData {
  name: string;
  code?: string;
  description?: string;
}

type UpdateSubjectData = Partial<Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>>;

interface SubjectsContextType {
  subjects: Subject[];
  loading: boolean;
  editingSubject: Subject | null;
  setEditingSubject: (subject: Subject | null) => void;
  formValues: Record<string, unknown>;
  setFormValues: (values: Record<string, unknown>) => void;
  loadSubjects: () => Promise<void>;
  createSubject: (data: CreateSubjectData) => Promise<Subject>;
  updateSubject: (id: string, data: UpdateSubjectData) => Promise<Subject>;
  deleteSubject: (id: string, name: string) => Promise<void>;
}

const SubjectsContext = createContext<SubjectsContextType | undefined>(undefined);

export function SubjectsProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});

  const loadSubjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSubjects();
      setSubjects(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`Failed to load subjects: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleCreateSubject = useCallback(async (data: CreateSubjectData) => {
    const toastId = toast.loading('Creating new subject...');

    try {
      const newSubject = await createSubject(data);
      setSubjects(prev => [...prev, newSubject]);

      toast.success('Subject created successfully', { id: toastId });

      return newSubject;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`Failed to create subject: ${errorMessage}`, { id: toastId });
      throw error;
    }
  }, [toast]);

  const handleUpdateSubject = useCallback(async (id: string, data: UpdateSubjectData) => {
    const toastId = toast.loading('Updating subject...');

    try {
      const updatedSubject = await updateSubject(id, data);
      setSubjects(prev => prev.map(subject => subject.id === id ? updatedSubject : subject));

      toast.success('Subject updated successfully', { id: toastId });

      return updatedSubject;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`Failed to update subject: ${errorMessage}`, { id: toastId });
      throw error;
    }
  }, [toast]);

  const handleDeleteSubject = useCallback(async (id: string, name: string) => {
    const toastId = toast.loading(`Deleting ${name}...`);

    try {
      await deleteSubject(id);
      setSubjects(prev => prev.filter(subject => subject.id !== id));

      toast.success('Subject deleted successfully', { id: toastId });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`Failed to delete subject: ${errorMessage}`, { id: toastId });
      throw error;
    }
  }, [toast]);

  return (
    <SubjectsContext.Provider
      value={{
        subjects,
        loading,
        editingSubject,
        setEditingSubject,
        formValues,
        setFormValues,
        loadSubjects,
        createSubject: handleCreateSubject,
        updateSubject: handleUpdateSubject,
        deleteSubject: handleDeleteSubject,
      }}
    >
      {children}
    </SubjectsContext.Provider>
  );
}

export function useSubjects() {
  const context = useContext(SubjectsContext);
  if (context === undefined) {
    throw new Error('useSubjects must be used within a SubjectsProvider');
  }
  return context;
}
