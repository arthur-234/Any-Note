'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Search } from 'lucide-react';
import { NoteCard } from './note-card';
import { NoteModal } from './note-modal';
import { Note } from '@/types/note';
import { ANIMATIONS } from '@/constants';

interface NotesListProps {
  notes: Note[];
  onEditNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
  onTogglePin: (id: string) => void;
  isLoading?: boolean;
}

export function NotesList({ 
  notes, 
  onEditNote, 
  onDeleteNote, 
  onTogglePin,
  isLoading = false 
}: NotesListProps) {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewNote = (note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNote(null);
  };

  const handleEditFromModal = (note: Note) => {
    onEditNote(note);
    handleCloseModal();
  };
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-48 bg-muted animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center py-16 px-4"
        {...ANIMATIONS.FADE_IN}
      >
        <div className="text-center space-y-4 max-w-md">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold">Nenhuma nota encontrada</h3>
          <p className="text-muted-foreground">
            Comece criando sua primeira nota ou ajuste os filtros de busca.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="p-4">
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        layout
      >
        <AnimatePresence mode="popLayout">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={onEditNote}
              onDelete={onDeleteNote}
              onTogglePin={onTogglePin}
              onView={handleViewNote}
            />
          ))}
        </AnimatePresence>
      </motion.div>
      
      <NoteModal
        note={selectedNote}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onEdit={handleEditFromModal}
      />
    </div>
  );
}