'use client';

import { create } from 'zustand';
import { Note } from '@/types/note';
import { notesStorage } from '@/lib/storage';

interface NotesState {
  notes: Note[];
  searchTerm: string;
  selectedTags: string[];
  sortBy: 'title' | 'createdAt' | 'updatedAt';
  sortOrder: 'asc' | 'desc';
  isLoading: boolean;
}

interface NotesActions {
  loadUserNotes: (userId: string) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (noteId: string, updates: Partial<Note>) => void;
  deleteNote: (noteId: string) => void;
  setSearchTerm: (term: string) => void;
  setSelectedTags: (tags: string[]) => void;
  setSortBy: (sortBy: NotesState['sortBy']) => void;
  setSortOrder: (order: NotesState['sortOrder']) => void;
  clearNotes: () => void;
  getFilteredNotes: () => Note[];
  getAllTags: () => string[];
  toggleTag: (tag: string) => void;
  clearSelectedTags: () => void;
}

type NotesStore = NotesState & NotesActions;

export const useNotesStore = create<NotesStore>((set, get) => ({
  // State
  notes: [],
  searchTerm: '',
  selectedTags: [],
  sortBy: 'updatedAt',
  sortOrder: 'desc',
  isLoading: false,

  // Actions
  loadUserNotes: (userId: string) => {
    set({ isLoading: true });
    try {
      const userNotes = notesStorage.getUserNotes(userId);
      set({ notes: userNotes, isLoading: false });
    } catch (error) {
      console.error('Erro ao carregar notas:', error);
      set({ isLoading: false });
    }
  },

  addNote: (noteData) => {
    const newNote: Note = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    notesStorage.saveNote(newNote);
    set((state) => ({
      notes: [newNote, ...state.notes],
    }));
  },

  updateNote: (noteId: string, updates: Partial<Note>) => {
    const { notes } = get();
    const noteIndex = notes.findIndex(note => note.id === noteId);
    
    if (noteIndex === -1) return;

    const updatedNote = {
      ...notes[noteIndex],
      ...updates,
      updatedAt: new Date(),
    };

    notesStorage.saveNote(updatedNote);
    
    set((state) => ({
      notes: state.notes.map(note => 
        note.id === noteId ? updatedNote : note
      ),
    }));
  },

  deleteNote: (noteId: string) => {
    notesStorage.deleteNote(noteId);
    set((state) => ({
      notes: state.notes.filter(note => note.id !== noteId),
    }));
  },

  setSearchTerm: (term: string) => {
    set({ searchTerm: term });
  },

  setSelectedTags: (tags: string[]) => {
    set({ selectedTags: tags });
  },

  setSortBy: (sortBy: NotesState['sortBy']) => {
    set({ sortBy });
  },

  setSortOrder: (order: NotesState['sortOrder']) => {
    set({ sortOrder: order });
  },

  clearNotes: () => {
    set({ notes: [], searchTerm: '', selectedTags: [] });
  },

  getFilteredNotes: () => {
    const { notes, searchTerm, selectedTags, sortBy, sortOrder } = get();
    
    let filtered = [...notes];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(note =>
        selectedTags.every(tag => note.tags.includes(tag))
      );
    }

    // Sort notes
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
        default:
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  },

  getAllTags: () => {
    const { notes } = get();
    const allTags = notes.flatMap(note => note.tags);
    return Array.from(new Set(allTags)).sort();
  },

  // Tag management
  toggleTag: (tag: string) => {
    set((state) => ({
      selectedTags: state.selectedTags.includes(tag)
        ? state.selectedTags.filter(t => t !== tag)
        : [...state.selectedTags, tag]
    }));
  },

  clearSelectedTags: () => {
    set({ selectedTags: [] });
  },
}));