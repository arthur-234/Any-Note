'use client';

import { useMemo } from 'react';
import { Note } from '@/types/note';

interface UseFilteredNotesProps {
  notes: Note[];
  searchTerm: string;
  selectedTags: string[];
  sortBy: 'createdAt' | 'updatedAt' | 'title';
  sortOrder: 'asc' | 'desc';
}

export function useFilteredNotes({
  notes,
  searchTerm,
  selectedTags,
  sortBy,
  sortOrder,
}: UseFilteredNotesProps) {
  const filteredAndSortedNotes = useMemo(() => {
    let filtered = notes;

    // Filtrar por termo de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        note =>
          note.title.toLowerCase().includes(term) ||
          note.content.toLowerCase().includes(term) ||
          note.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Filtrar por tags selecionadas
    if (selectedTags.length > 0) {
      filtered = filtered.filter(note =>
        selectedTags.every(tag => note.tags.includes(tag))
      );
    }

    // Ordenar notas
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'createdAt':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case 'updatedAt':
          comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    // Separar notas fixadas
    const pinnedNotes = sorted.filter(note => note.isPinned);
    const unpinnedNotes = sorted.filter(note => !note.isPinned);

    return [...pinnedNotes, ...unpinnedNotes];
  }, [notes, searchTerm, selectedTags, sortBy, sortOrder]);

  // Extrair todas as tags únicas
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    notes.forEach(note => {
      note.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [notes]);

  return {
    filteredNotes: filteredAndSortedNotes,
    allTags,
    totalNotes: notes.length,
    filteredCount: filteredAndSortedNotes.length,
  };
}