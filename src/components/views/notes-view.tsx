'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, SortAsc, SortDesc } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NoteCard } from '@/components/notes/note-card';
import { useAuth } from '@/hooks/useAuth';
import { useNotesStore } from '@/store';
import { Note } from '@/types/note';

interface NotesViewProps {
  onNewNote: () => void;
  onEditNote: (note: Note) => void;
}

export function NotesView({ onNewNote, onEditNote }: NotesViewProps) {
  const { user } = useAuth();
  const {
    notes,
    searchTerm,
    selectedTags,
    sortBy,
    sortOrder,
    isLoading,
    loadNotes,
    setSearchTerm,
    toggleTag,
    setSortBy,
    setSortOrder,
    deleteNote,
    clearSelectedTags,
    getFilteredNotes,
    getAllTags,
  } = useNotesStore();

  // Load notes when user changes
  useEffect(() => {
    if (user) {
      loadNotes(user.id);
    }
  }, [user, loadNotes]);

  const filteredNotes = getFilteredNotes();
  const allTags = getAllTags();

  const handleDeleteNote = (noteId: string) => {
    if (!user) return;
    deleteNote(noteId);
  };

  const handleTagToggle = (tag: string) => {
    toggleTag(tag);
  };

  const clearFilters = () => {
    setSearchTerm('');
    clearSelectedTags();
    setSortBy('updated');
    setSortOrder('desc');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold">Minhas Notas</h1>
          <p className="text-muted-foreground">
            {filteredNotes.length} de {notes.length} notas
          </p>
        </div>
        <Button onClick={onNewNote} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Nota
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="backdrop-blur-sm bg-background/95 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros e Busca
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar notas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort and Order */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Select value={sortBy} onValueChange={(value: 'date' | 'title' | 'updated') => setSortBy(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="updated">Última modificação</SelectItem>
                    <SelectItem value="date">Data de criação</SelectItem>
                    <SelectItem value="title">Título</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>
            </div>

            {/* Tags */}
            {allTags.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/80"
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Clear Filters */}
            {(searchTerm || selectedTags.length > 0 || sortBy !== 'updated' || sortOrder !== 'desc') && (
              <Button variant="outline" onClick={clearFilters} className="w-full">
                Limpar Filtros
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Notes Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filteredNotes.length === 0 ? (
          <Card className="backdrop-blur-sm bg-background/95 border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="text-6xl">📝</div>
                <h3 className="text-xl font-semibold">
                  {notes.length === 0 ? 'Nenhuma nota criada' : 'Nenhuma nota encontrada'}
                </h3>
                <p className="text-muted-foreground max-w-md">
                  {notes.length === 0
                    ? 'Comece criando sua primeira nota para organizar suas ideias.'
                    : 'Tente ajustar os filtros ou criar uma nova nota.'
                  }
                </p>
                <Button onClick={onNewNote} className="gap-2">
                  <Plus className="h-4 w-4" />
                  {notes.length === 0 ? 'Criar Primeira Nota' : 'Nova Nota'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <NoteCard
                  note={note}
                  onEdit={() => onEditNote(note)}
                  onDelete={() => handleDeleteNote(note.id)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}