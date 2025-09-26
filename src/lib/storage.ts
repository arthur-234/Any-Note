import { User, UserData } from '@/types/user';
import { Note } from '@/types/note';
import { Task } from '@/types/task';

const STORAGE_KEYS = {
  USERS: 'notes_app_users',
  CURRENT_USER: 'notes_app_current_user',
  NOTES: 'notes_app_notes',
  TASKS: 'notes_app_tasks',
} as const;

// Funções para usuários
export const userStorage = {
  // Obter todos os usuários
  getUsers(): User[] {
    if (typeof window === 'undefined') return [];
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  },

  // Salvar usuário
  saveUser(user: User): void {
    if (typeof window === 'undefined') return;
    const users = this.getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  // Buscar usuário por username
  findByUsername(username: string): User | null {
    const users = this.getUsers();
    return users.find(u => u.username === username) || null;
  },

  // Buscar usuário por token
  findByToken(token: string): User | null {
    const users = this.getUsers();
    return users.find(u => u.token === token) || null;
  },

  // Obter usuário atual
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const currentUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return currentUser ? JSON.parse(currentUser) : null;
  },

  // Definir usuário atual
  setCurrentUser(user: User | null): void {
    if (typeof window === 'undefined') return;
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  // Gerar token único
  generateToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  },

  // Criar usuário padrão (para desenvolvimento)
  createDefaultUser(): User {
    const defaultUser: User = {
      id: '1',
      username: 'admin',
      password: 'admin123',
      token: this.generateToken(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.saveUser(defaultUser);
    return defaultUser;
  }
};

// Funções para notas (com filtro por usuário)
export const notesStorage = {
  // Obter todas as notas
  getAllNotes(): Note[] {
    if (typeof window === 'undefined') return [];
    const notes = localStorage.getItem(STORAGE_KEYS.NOTES);
    return notes ? JSON.parse(notes, (key, value) => {
      if (key === 'createdAt' || key === 'updatedAt') {
        return new Date(value);
      }
      return value;
    }) : [];
  },

  // Obter notas do usuário atual
  getUserNotes(userId: string): Note[] {
    return this.getAllNotes().filter(note => note.userId === userId);
  },

  // Salvar nota
  saveNote(note: Note): void {
    if (typeof window === 'undefined') return;
    const notes = this.getAllNotes();
    const existingIndex = notes.findIndex(n => n.id === note.id);
    
    if (existingIndex >= 0) {
      notes[existingIndex] = note;
    } else {
      notes.push(note);
    }
    
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  },

  // Deletar nota
  deleteNote(noteId: string): void {
    if (typeof window === 'undefined') return;
    const notes = this.getAllNotes().filter(n => n.id !== noteId);
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  }
};

// Funções para tarefas
export const tasksStorage = {
  // Obter todas as tarefas
  getAllTasks(): Task[] {
    if (typeof window === 'undefined') return [];
    const tasks = localStorage.getItem(STORAGE_KEYS.TASKS);
    return tasks ? JSON.parse(tasks, (key, value) => {
      if (key === 'createdAt' || key === 'updatedAt' || key === 'dueDate') {
        return value ? new Date(value) : undefined;
      }
      return value;
    }) : [];
  },

  // Obter tarefas do usuário atual
  getUserTasks(userId: string): Task[] {
    return this.getAllTasks().filter(task => task.userId === userId);
  },

  // Salvar tarefa
  saveTask(task: Task): void {
    if (typeof window === 'undefined') return;
    const tasks = this.getAllTasks();
    const existingIndex = tasks.findIndex(t => t.id === task.id);
    
    if (existingIndex >= 0) {
      tasks[existingIndex] = task;
    } else {
      tasks.push(task);
    }
    
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  },

  // Deletar tarefa
  deleteTask(taskId: string): void {
    if (typeof window === 'undefined') return;
    const tasks = this.getAllTasks().filter(t => t.id !== taskId);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }
};