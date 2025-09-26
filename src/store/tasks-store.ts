'use client';

import { create } from 'zustand';
import { Task, TaskStatus } from '@/types/task';
import { tasksStorage } from '@/lib/storage';

interface TasksState {
  tasks: Task[];
  searchTerm: string;
  statusFilter: TaskStatus | 'all';
  isLoading: boolean;
}

interface TasksActions {
  loadUserTasks: (userId: string) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskCompletion: (taskId: string) => void;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: TaskStatus | 'all') => void;
  clearTasks: () => void;
  getFilteredTasks: () => Task[];
  getTaskStats: () => {
    total: number;
    completed: number;
    pending: number;
    completionRate: number;
  };
}

type TasksStore = TasksState & TasksActions;

export const useTasksStore = create<TasksStore>((set, get) => ({
  // State
  tasks: [],
  searchTerm: '',
  statusFilter: 'all',
  isLoading: false,

  // Actions
  loadUserTasks: (userId: string) => {
    set({ isLoading: true });
    try {
      const userTasks = tasksStorage.getUserTasks(userId);
      set({ tasks: userTasks, isLoading: false });
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
      set({ isLoading: false });
    }
  },

  addTask: (taskData) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    tasksStorage.saveTask(newTask);
    set((state) => ({
      tasks: [newTask, ...state.tasks],
    }));
  },

  updateTask: (taskId: string, updates: Partial<Task>) => {
    const { tasks } = get();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) return;

    const updatedTask = {
      ...tasks[taskIndex],
      ...updates,
      updatedAt: new Date(),
    };

    tasksStorage.saveTask(updatedTask);
    
    set((state) => ({
      tasks: state.tasks.map(task => 
        task.id === taskId ? updatedTask : task
      ),
    }));
  },

  deleteTask: (taskId: string) => {
    tasksStorage.deleteTask(taskId);
    set((state) => ({
      tasks: state.tasks.filter(task => task.id !== taskId),
    }));
  },

  toggleTaskCompletion: (taskId: string) => {
    const { tasks } = get();
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) return;

    const updatedTask = {
      ...task,
      completed: !task.completed,
      updatedAt: new Date(),
    };

    tasksStorage.saveTask(updatedTask);
    
    set((state) => ({
      tasks: state.tasks.map(t => 
        t.id === taskId ? updatedTask : t
      ),
    }));
  },

  setSearchTerm: (term: string) => {
    set({ searchTerm: term });
  },

  setStatusFilter: (status: TaskStatus | 'all') => {
    set({ statusFilter: status });
  },

  clearTasks: () => {
    set({ tasks: [], searchTerm: '', statusFilter: 'all' });
  },

  getFilteredTasks: () => {
    const { tasks, searchTerm, statusFilter } = get();
    
    let filtered = [...tasks];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => 
        statusFilter === 'completed' ? task.completed : !task.completed
      );
    }

    // Sort by creation date (newest first)
    return filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  getTaskStats: () => {
    const { tasks } = get();
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      pending,
      completionRate,
    };
  },
}));