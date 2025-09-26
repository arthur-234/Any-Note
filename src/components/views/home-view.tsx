'use client';

import { motion } from 'framer-motion';
import { FileText, CheckSquare, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { notesStorage, tasksStorage } from '@/lib/storage';
import { useMemo } from 'react';

interface HomeViewProps {
  onViewChange: (view: string) => void;
  onNewNote: () => void;
}

export function HomeView({ onViewChange, onNewNote }: HomeViewProps) {
  const { user } = useAuth();

  const stats = useMemo(() => {
    if (!user) return { totalNotes: 0, totalTasks: 0, completedTasks: 0, recentNotes: [] };

    const userNotes = notesStorage.getUserNotes(user.id);
    const userTasks = tasksStorage.getUserTasks(user.id);
    const completedTasks = userTasks.filter(task => task.completed).length;
    const recentNotes = userNotes
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 3);

    return {
      totalNotes: userNotes.length,
      totalTasks: userTasks.length,
      completedTasks,
      recentNotes
    };
  }, [user]);

  const quickActions = [
    {
      title: 'Nova Nota',
      description: 'Criar uma nova nota',
      icon: FileText,
      action: onNewNote,
      color: 'bg-blue-500/10 text-blue-600 border-blue-200'
    },
    {
      title: 'Ver Notas',
      description: 'Acessar todas as notas',
      icon: FileText,
      action: () => onViewChange('notes'),
      color: 'bg-green-500/10 text-green-600 border-green-200'
    },
    {
      title: 'Tarefas',
      description: 'Gerenciar tarefas',
      icon: CheckSquare,
      action: () => onViewChange('tasks'),
      color: 'bg-purple-500/10 text-purple-600 border-purple-200'
    }
  ];

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold">
          Olá, {user?.username}! 👋
        </h1>
        <p className="text-muted-foreground">
          Bem-vindo de volta ao Any Note. Aqui está um resumo das suas atividades.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-shrink-0"
      >
        <Card className="backdrop-blur-sm bg-background/95 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Notas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalNotes}</div>
            <p className="text-xs text-muted-foreground">
              Suas notas organizadas
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-background/95 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.completedTasks}/{stats.totalTasks}
            </div>
            <p className="text-xs text-muted-foreground">
              Tarefas concluídas
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-background/95 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtividade</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Taxa de conclusão
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex-1 flex flex-col"
      >
        <Card className="backdrop-blur-sm bg-background/95 border-border/50 flex-1 flex flex-col">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Acesse rapidamente as funcionalidades principais
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className={`h-auto p-4 flex flex-col items-center space-y-2 w-full ${action.color}`}
                      onClick={action.action}
                    >
                      <Icon className="h-6 w-6" />
                      <div className="text-center">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {action.description}
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Notes */}
      {stats.recentNotes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="backdrop-blur-sm bg-background/95 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Notas Recentes
              </CardTitle>
              <CardDescription>
                Suas últimas notas editadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recentNotes.map((note, index) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => onViewChange('notes')}
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{note.title}</h4>
                      <p className="text-sm text-muted-foreground truncate">
                        {note.content.substring(0, 100)}...
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {note.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {note.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{note.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Intl.DateTimeFormat('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      }).format(new Date(note.updatedAt))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}