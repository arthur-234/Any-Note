export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  noteId?: string; // ID da nota atrelada (opcional)
  tags: string[];
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface TaskFilter {
  status?: TaskStatus;
  priority?: Task['priority'];
  tags?: string[];
  searchTerm?: string;
}