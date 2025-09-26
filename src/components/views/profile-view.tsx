'use client';

import { motion } from 'framer-motion';
import { User, LogOut, Calendar, FileText, CheckSquare, TrendingUp, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { notesStorage, tasksStorage } from '@/lib/storage';
import { useMemo, useState } from 'react';

interface ProfileViewProps {}

export function ProfileView({}: ProfileViewProps) {
  const { user, logout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const userStats = useMemo(() => {
    if (!user) return null;

    const notes = notesStorage.getUserNotes(user.id);
    const tasks = tasksStorage.getUserTasks(user.id);
    const completedTasks = tasks.filter(task => task.completed);
    
    // Calculate activity over last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentNotes = notes.filter(note => 
      new Date(note.createdAt) > sevenDaysAgo
    );
    
    const recentTasks = tasks.filter(task => 
      new Date(task.createdAt) > sevenDaysAgo
    );

    // Calculate productivity score
    const totalTasks = tasks.length;
    const productivityScore = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

    // Get most used tags
    const tagCount = new Map<string, number>();
    notes.forEach(note => {
      note.tags.forEach(tag => {
        tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
      });
    });
    
    const topTags = Array.from(tagCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      totalNotes: notes.length,
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      pendingTasks: tasks.length - completedTasks.length,
      recentNotesCount: recentNotes.length,
      recentTasksCount: recentTasks.length,
      productivityScore,
      topTags,
      joinDate: user.createdAt ? new Date(user.createdAt) : new Date(),
      lastActivity: notes.length > 0 || tasks.length > 0 ? 
        new Date(Math.max(
          ...notes.map(n => new Date(n.updatedAt).getTime()),
          ...tasks.map(t => new Date(t.updatedAt).getTime())
        )) : new Date()
    };
  }, [user]);

  const handleLogout = () => {
    logout();
    setShowLogoutDialog(false);
  };

  if (!user || !userStats) {
    return null;
  }

  const achievements = [
    {
      title: 'Primeiro Passo',
      description: 'Criou sua primeira nota',
      achieved: userStats.totalNotes > 0,
      icon: '📝'
    },
    {
      title: 'Organizador',
      description: 'Criou 10 notas',
      achieved: userStats.totalNotes >= 10,
      icon: '📚'
    },
    {
      title: 'Produtivo',
      description: 'Completou 5 tarefas',
      achieved: userStats.completedTasks >= 5,
      icon: '✅'
    },
    {
      title: 'Consistente',
      description: 'Ativo nos últimos 7 dias',
      achieved: userStats.recentNotesCount > 0 || userStats.recentTasksCount > 0,
      icon: '🔥'
    },
    {
      title: 'Mestre das Tags',
      description: 'Usou mais de 5 tags diferentes',
      achieved: userStats.topTags.length >= 5,
      icon: '🏷️'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user.username}</h1>
            <p className="text-muted-foreground">
              Membro desde {userStats.joinDate.toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
        
        <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </DialogTrigger>
          <DialogContent className="backdrop-blur-sm bg-background/95">
            <DialogHeader>
              <DialogTitle>Confirmar logout</DialogTitle>
              <DialogDescription>
                Tem certeza de que deseja sair da sua conta? Você precisará fazer login novamente para acessar suas notas e tarefas.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowLogoutDialog(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Card className="backdrop-blur-sm bg-background/95 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.totalNotes}</div>
            <p className="text-xs text-muted-foreground">
              +{userStats.recentNotesCount} esta semana
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-background/95 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              {userStats.completedTasks} concluídas
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-background/95 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtividade</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.productivityScore}%</div>
            <p className="text-xs text-muted-foreground">
              Taxa de conclusão
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-background/95 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atividade</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userStats.recentNotesCount + userStats.recentTasksCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Últimos 7 dias
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Account Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="backdrop-blur-sm bg-background/95 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Informações da Conta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Nome de usuário</Label>
                <p className="text-sm text-muted-foreground">{user.username}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Última atividade</Label>
                <p className="text-sm text-muted-foreground">
                  {userStats.lastActivity.toLocaleDateString('pt-BR')} às {userStats.lastActivity.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <Label className="text-sm font-medium">Token de recuperação</Label>
              <div className="flex items-center gap-2 mt-1">
                <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                  {user.recoveryToken}
                </code>
                <Badge variant="secondary" className="text-xs">
                  Guarde este token para recuperação
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Use este token para recuperar sua conta caso esqueça a senha
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Top Tags */}
      {userStats.topTags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="backdrop-blur-sm bg-background/95 border-border/50">
            <CardHeader>
              <CardTitle>Tags Mais Usadas</CardTitle>
              <CardDescription>
                Suas tags favoritas para organizar notas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {userStats.topTags.map(([tag, count]) => (
                  <Badge key={tag} variant="outline" className="gap-1">
                    {tag}
                    <span className="text-xs text-muted-foreground">({count})</span>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="backdrop-blur-sm bg-background/95 border-border/50">
          <CardHeader>
            <CardTitle>Conquistas</CardTitle>
            <CardDescription>
              Marcos alcançados na sua jornada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    achievement.achieved 
                      ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
                      : 'bg-muted/50 border-border'
                  }`}
                >
                  <div className={`text-2xl ${achievement.achieved ? '' : 'grayscale opacity-50'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${achievement.achieved ? 'text-green-700 dark:text-green-300' : 'text-muted-foreground'}`}>
                      {achievement.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.achieved && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                      Conquistado
                    </Badge>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function Label({ className, children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className || ''}`} {...props}>
      {children}
    </label>
  );
}