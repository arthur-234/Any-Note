'use client';

import { useState, useEffect, useCallback } from 'react';
import { Note, NoteFormData, NotesState, NotesActions } from '@/types/note';
import { STORAGE_KEYS } from '@/constants';

export function useNotes(): NotesState & NotesActions {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<NotesState['sortBy']>('updatedAt');
  const [sortOrder, setSortOrder] = useState<NotesState['sortOrder']>('desc');

  // Carregar notas do localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes).map((note: Omit<Note, 'createdAt' | 'updatedAt'> & { createdAt: string; updatedAt: string }) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        }));
        setNotes(parsedNotes);
      } catch (error) {
        console.error('Erro ao carregar notas:', error);
      }
    }
  }, []);

  // Salvar notas no localStorage
  const saveNotes = useCallback((notesToSave: Note[]) => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notesToSave));
  }, []);

  const addNote = useCallback((noteData: NoteFormData) => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      ...noteData,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPinned: false,
    };

    setNotes(prev => {
      const updated = [newNote, ...prev];
      saveNotes(updated);
      return updated;
    });
  }, [saveNotes]);

  const updateNote = useCallback((id: string, noteData: Partial<NoteFormData>) => {
    setNotes(prev => {
      const updated = prev.map(note =>
        note.id === id
          ? { ...note, ...noteData, updatedAt: new Date() }
          : note
      );
      saveNotes(updated);
      return updated;
    });
  }, [saveNotes]);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => {
      const updated = prev.filter(note => note.id !== id);
      saveNotes(updated);
      return updated;
    });
  }, [saveNotes]);

  const togglePin = useCallback((id: string) => {
    setNotes(prev => {
      const updated = prev.map(note =>
        note.id === id
          ? { ...note, isPinned: !note.isPinned, updatedAt: new Date() }
          : note
      );
      saveNotes(updated);
      return updated;
    });
  }, [saveNotes]);

  return {
    notes,
    searchTerm,
    selectedTags,
    sortBy,
    sortOrder,
    addNote,
    updateNote,
    deleteNote,
    togglePin,
    setSearchTerm,
    setSelectedTags,
    setSortBy,
    setSortOrder,
  };
}