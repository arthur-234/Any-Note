'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, CheckSquare, Square, Calendar, Filter, Search, Trash2, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useTasksStore, useNotesStore } from '@/store';
import { Task, TaskStatus } from '@/types/task';

interface TasksViewProps {}

export function TasksView({}: TasksViewProps) {
  const { user } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    linkedNoteId: ''
  });

  const {
    tasks,
    searchTerm,
    statusFilter,
    isLoading,
    loadTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    setSearchTerm,
    setStatusFilter,
    getFilteredTasks,
    getTaskStats,
  } = useTasksStore();

  const { notes, loadNotes } = useNotesStore();

  // Load tasks and notes when user changes
  useEffect(() => {
    if (user) {
      loadTasks(user.id);
      loadNotes(user.id);
    }
  }, [user, loadTasks, loadNotes]);

  const filteredTasks = getFilteredTasks();
  const taskStats = getTaskStats();

  const handleCreateTask = () => {
    if (!user || !newTask.title.trim()) return;

    const task: Omit<Task, 'id'> = {
      title: newTask.title.trim(),
      description: newTask.description.trim(),
      completed: false,
      userId: user.id,
      linkedNoteId: newTask.linkedNoteId || undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    addTask(task);
    setNewTask({ title: '', description: '', linkedNoteId: '' });
    setIsCreateDialogOpen(false);
  };

  const handleUpdateTask = () => {
    if (!editingTask || !editingTask.title.trim()) return;

    const updatedTask: Task = {
      ...editingTask,
      updatedAt: new Date()
    };

    updateTask(updatedTask.id, updatedTask);
    setEditingTask(null);
  };

  const handleToggleTask = (taskId: string) => {
    toggleTaskCompletion(taskId);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
  };

  const getLinkedNote = (noteId?: string) => {
    if (!noteId) return null;
    return notes.find(note => note.id === noteId);
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
          <h1 className="text-3xl font-bold">Tarefas</h1>
          <p className="text-muted-foreground">
            Gerencie suas tarefas e mantenha-se organizado
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Tarefa
            </Button>
          </DialogTrigger>
          <DialogContent className="backdrop-blur-sm bg-background/95">
            <DialogHeader>
              <DialogTitle>Criar Nova Tarefa</DialogTitle>
              <DialogDescription>
                Adicione uma nova tarefa à sua lista
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Digite o título da tarefa..."
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Adicione uma descrição (opcional)..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="linkedNote">Vincular à Nota (opcional)</Label>
                <Select value={newTask.linkedNoteId} onValueChange={(value) => setNewTask(prev => ({ ...prev, linkedNoteId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma nota" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhuma nota</SelectItem>
                    {notes.map(note => (
                      <SelectItem key={note.id} value={note.id}>
                        {note.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateTask} disabled={!newTask.title.trim()}>
                Criar Tarefa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card className="backdrop-blur-sm bg-background/95 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.total}</div>
          </CardContent>
        </Card>
        <Card className="backdrop-blur-sm bg-background/95 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{taskStats.completed}</div>
          </CardContent>
        </Card>
        <Card className="backdrop-blur-sm bg-background/95 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{taskStats.pending}</div>
          </CardContent>
        </Card>
        <Card className="backdrop-blur-sm bg-background/95 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.completionRate}%</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="backdrop-blur-sm bg-background/95 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar tarefas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={(value: TaskStatus | 'all') => setStatusFilter(value)}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="completed">Concluídas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tasks List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {filteredTasks.length === 0 ? (
          <Card className="backdrop-blur-sm bg-background/95 border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="text-6xl">✅</div>
                <h3 className="text-xl font-semibold">
                  {tasks.length === 0 ? 'Nenhuma tarefa criada' : 'Nenhuma tarefa encontrada'}
                </h3>
                <p className="text-muted-foreground max-w-md">
                  {tasks.length === 0
                    ? 'Comece criando sua primeira tarefa para se manter organizado.'
                    : 'Tente ajustar os filtros ou criar uma nova tarefa.'
                  }
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  {tasks.length === 0 ? 'Criar Primeira Tarefa' : 'Nova Tarefa'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task, index) => {
              const linkedNote = getLinkedNote(task.linkedNoteId);
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                >
                  <Card className={`backdrop-blur-sm bg-background/95 border-border/50 transition-all hover:shadow-md ${
                    task.completed ? 'opacity-75' : ''
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="mt-1 h-6 w-6 p-0"
                          onClick={() => handleToggleTask(task.id)}
                        >
                          {task.completed ? (
                            <CheckSquare className="h-5 w-5 text-green-600" />
                          ) : (
                            <Square className="h-5 w-5" />
                          )}
                        </Button>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className={`text-sm mt-1 ${task.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                              {task.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {new Intl.DateTimeFormat('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              }).format(new Date(task.createdAt))}
                            </div>
                            
                            {linkedNote && (
                              <Badge variant="outline" className="text-xs">
                                📝 {linkedNote.title}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Dialog open={editingTask?.id === task.id} onOpenChange={(open) => !open && setEditingTask(null)}>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setEditingTask(task)}
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="backdrop-blur-sm bg-background/95">
                              <DialogHeader>
                                <DialogTitle>Editar Tarefa</DialogTitle>
                              </DialogHeader>
                              {editingTask && (
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="edit-title">Título</Label>
                                    <Input
                                      id="edit-title"
                                      value={editingTask.title}
                                      onChange={(e) => setEditingTask(prev => prev ? { ...prev, title: e.target.value } : null)}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-description">Descrição</Label>
                                    <Textarea
                                      id="edit-description"
                                      value={editingTask.description}
                                      onChange={(e) => setEditingTask(prev => prev ? { ...prev, description: e.target.value } : null)}
                                      rows={3}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-linkedNote">Nota Vinculada</Label>
                                    <Select 
                                      value={editingTask.linkedNoteId || ''} 
                                      onValueChange={(value) => setEditingTask(prev => prev ? { ...prev, linkedNoteId: value || undefined } : null)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecione uma nota" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="">Nenhuma nota</SelectItem>
                                        {notes.map(note => (
                                          <SelectItem key={note.id} value={note.id}>
                                            {note.title}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              )}
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setEditingTask(null)}>
                                  Cancelar
                                </Button>
                                <Button onClick={handleUpdateTask}>
                                  Salvar
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}