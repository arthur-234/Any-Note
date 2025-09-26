export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  isPinned: boolean;
  color?: string;
  userId: string;
}

export interface NoteFormData {
  title: string;
  content: string;
  tags: string[];
  color?: string;
}

export interface NotesState {
  notes: Note[];
  searchTerm: string;
  selectedTags: string[];
  sortBy: 'createdAt' | 'updatedAt' | 'title';
  sortOrder: 'asc' | 'desc';
}

export interface NotesActions {
  addNote: (note: NoteFormData) => void;
  updateNote: (id: string, note: Partial<NoteFormData>) => void;
  deleteNote: (id: string) => void;
  togglePin: (id: string) => void;
  setSearchTerm: (term: string) => void;
  setSelectedTags: (tags: string[]) => void;
  setSortBy: (sortBy: NotesState['sortBy']) => void;
  setSortOrder: (order: NotesState['sortOrder']) => void;
}