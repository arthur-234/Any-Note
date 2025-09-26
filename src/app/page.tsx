'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/login-form';
import { Sidebar } from '@/components/layout/sidebar';
import { NoteEditor } from '@/components/notes/note-editor';
import { HomeView } from '@/components/views/home-view';
import { NotesView } from '@/components/views/notes-view';
import { TasksView } from '@/components/views/tasks-view';
import { SettingsView } from '@/components/views/settings-view';
import { ProfileView } from '@/components/views/profile-view';
import { Note } from '@/types/note';
import { notesStorage } from '@/lib/storage';

export default function Home() {
  const { user, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState('home');
  const [selectedNote, setSelectedNote] = useState<Note | undefined>();
  const [isEditorOpen, setIsEditorOpen] = useState(false);

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

  const handleSaveNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (!user) return;

    const newNote: Note = {
      ...noteData,
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    notesStorage.saveNote(note);
    handleCloseEditor();
  };

  const handleUpdateNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (!user || !selectedNote) return;

    const updatedNote: Note = {
      ...selectedNote,
      ...noteData,
      updatedAt: new Date().toISOString()
    };

    notesStorage.saveNote(updatedNote);
    handleCloseEditor();
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomeView 
            onViewChange={setCurrentView}
            onNewNote={handleNewNote}
          />
        );
      case 'notes':
        return (
          <NotesView 
            onNewNote={handleNewNote}
            onEditNote={handleEditNote}
          />
        );
      case 'tasks':
        return <TasksView />;
      case 'settings':
        return <SettingsView />;
      case 'profile':
        return <ProfileView />;
      default:
        return (
          <HomeView 
            onViewChange={setCurrentView}
            onNewNote={handleNewNote}
          />
        );
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Carregando...</p>
        </motion.div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Any Note
            </h1>
            <p className="text-muted-foreground mt-2">
              Organize suas ideias e tarefas
            </p>
          </div>
          <LoginForm />
        </motion.div>
      </div>
    );
  }

  // Main application layout
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          onNewNote={handleNewNote}
        />
        
        <main className="flex-1 lg:ml-[240px]">
          <div className="p-2 pl-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderCurrentView()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <NoteEditor
        note={selectedNote}
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
        onSave={handleSaveNote}
        onUpdate={handleUpdateNote}
      />
    </div>
  );
}
