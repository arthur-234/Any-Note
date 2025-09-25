'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { NotesList } from '@/components/notes/notes-list';
import { NoteEditor } from '@/components/notes/note-editor';
import { NotesFilters } from '@/components/notes/notes-filters';
import { useNotes } from '@/hooks/useNotes';
import { useFilteredNotes } from '@/hooks/useFilteredNotes';
import { Note } from '@/types/note';

export default function Home() {
  const [selectedNote, setSelectedNote] = useState<Note | undefined>();
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const {
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
  } = useNotes();

  const { filteredNotes, allTags, totalNotes, filteredCount } = useFilteredNotes({
    notes,
    searchTerm,
    selectedTags,
    sortBy,
    sortOrder,
  });

  const handleNewNote = () => {
    setSelectedNote(undefined);
    setIsEditorOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setSelectedNote(undefined);
  };

  const handleDeleteNote = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta nota?')) {
      deleteNote(id);
    }
  };

  const handleTagToggle = (tag: string) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newSelectedTags);
  };

  const handleClearTags = () => {
    setSelectedTags([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onNewNote={handleNewNote}
      />

      <NotesFilters
        allTags={allTags}
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
        onClearTags={handleClearTags}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={setSortBy}
        onSortOrderChange={setSortOrder}
        totalNotes={totalNotes}
        filteredCount={filteredCount}
      />

      <main className="container mx-auto px-6">
        <NotesList
          notes={filteredNotes}
          onEditNote={handleEditNote}
          onDeleteNote={handleDeleteNote}
          onTogglePin={togglePin}
        />
      </main>

      <NoteEditor
        note={selectedNote}
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
        onSave={addNote}
        onUpdate={updateNote}
      />
    </div>
  );
}
