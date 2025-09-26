'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Shield, Palette, Download, Upload, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from 'next-themes';
import { notesStorage, tasksStorage, userStorage } from '@/lib/storage';

interface SettingsViewProps {}

export function SettingsView({}: SettingsViewProps) {
  const { user, updateProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: user?.username || '',
    password: ''
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleSaveProfile = () => {
    if (!user || !editForm.username.trim()) return;

    updateProfile({
      username: editForm.username.trim(),
      ...(editForm.password && { password: editForm.password })
    });

    setIsEditing(false);
    setEditForm(prev => ({ ...prev, password: '' }));
  };

  const handleExportData = () => {
    if (!user) return;

    const userData = {
      user: user,
      notes: notesStorage.getUserNotes(user.id),
      tasks: tasksStorage.getUserTasks(user.id),
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `any-note-backup-${user.username}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // Import notes
        if (data.notes && Array.isArray(data.notes)) {
          data.notes.forEach((note: any) => {
            notesStorage.saveNote({ ...note, userId: user.id });
          });
        }

        // Import tasks
        if (data.tasks && Array.isArray(data.tasks)) {
          data.tasks.forEach((task: any) => {
            tasksStorage.saveTask({ ...task, userId: user.id });
          });
        }

        alert('Dados importados com sucesso!');
      } catch (error) {
        alert('Erro ao importar dados. Verifique se o arquivo está correto.');
      }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  };

  const handleDeleteAllData = () => {
    if (!user) return;

    // Delete all user notes
    const userNotes = notesStorage.getUserNotes(user.id);
    userNotes.forEach(note => notesStorage.deleteNote(note.id));

    // Delete all user tasks
    const userTasks = tasksStorage.getUserTasks(user.id);
    userTasks.forEach(task => tasksStorage.deleteTask(task.id));

    setShowDeleteDialog(false);
    alert('Todos os dados foram excluídos!');
  };

  const stats = {
    notes: user ? notesStorage.getUserNotes(user.id).length : 0,
    tasks: user ? tasksStorage.getUserTasks(user.id).length : 0,
    completedTasks: user ? tasksStorage.getUserTasks(user.id).filter(t => t.completed).length : 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8" />
          Configurações
        </h1>
        <p className="text-muted-foreground">
          Gerencie suas preferências e dados da conta
        </p>
      </motion.div>

      {/* Profile Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="backdrop-blur-sm bg-background/95 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Perfil do Usuário
            </CardTitle>
            <CardDescription>
              Gerencie suas informações pessoais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isEditing ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Nome de usuário</Label>
                    <p className="text-sm text-muted-foreground">{user?.username}</p>
                  </div>
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    Editar
                  </Button>
                </div>
                <div>
                  <Label className="text-sm font-medium">Token de recuperação</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                      {user?.token}
                    </code>
                    <Badge variant="secondary" className="text-xs">
                      Guarde este token para recuperação
                    </Badge>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="username">Nome de usuário</Label>
                  <Input
                    id="username"
                    value={editForm.username}
                    onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Digite seu nome de usuário"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Nova senha (opcional)</Label>
                  <Input
                    id="password"
                    type="password"
                    value={editForm.password}
                    onChange={(e) => setEditForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Digite uma nova senha"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveProfile} disabled={!editForm.username.trim()}>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setIsEditing(false);
                    setEditForm({ username: user?.username || '', password: '' });
                  }}>
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Theme Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="backdrop-blur-sm bg-background/95 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Aparência
            </CardTitle>
            <CardDescription>
              Personalize a aparência do aplicativo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Tema escuro</Label>
                <p className="text-sm text-muted-foreground">
                  Alterne entre tema claro e escuro
                </p>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="backdrop-blur-sm bg-background/95 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Gerenciamento de Dados
            </CardTitle>
            <CardDescription>
              Exporte, importe ou exclua seus dados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.notes}</div>
                <div className="text-sm text-muted-foreground">Notas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.tasks}</div>
                <div className="text-sm text-muted-foreground">Tarefas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.completedTasks}</div>
                <div className="text-sm text-muted-foreground">Concluídas</div>
              </div>
            </div>

            <Separator />

            {/* Export/Import */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Exportar dados</Label>
                  <p className="text-sm text-muted-foreground">
                    Baixe um backup de todas as suas notas e tarefas
                  </p>
                </div>
                <Button variant="outline" onClick={handleExportData}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Importar dados</Label>
                  <p className="text-sm text-muted-foreground">
                    Restaure dados de um backup anterior
                  </p>
                </div>
                <div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    style={{ display: 'none' }}
                    id="import-file"
                  />
                  <Button variant="outline" onClick={() => document.getElementById('import-file')?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Importar
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Danger Zone */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-destructive">Zona de perigo</Label>
                  <p className="text-sm text-muted-foreground">
                    Exclua permanentemente todos os seus dados
                  </p>
                </div>
                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir tudo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="backdrop-blur-sm bg-background/95">
                    <DialogHeader>
                      <DialogTitle>Excluir todos os dados</DialogTitle>
                      <DialogDescription>
                        Esta ação não pode ser desfeita. Todos os seus dados (notas e tarefas) serão permanentemente excluídos.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                        Cancelar
                      </Button>
                      <Button variant="destructive" onClick={handleDeleteAllData}>
                        Sim, excluir tudo
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}