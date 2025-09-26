'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusCircle, 
  FileText, 
  Settings, 
  CheckSquare, 
  User, 
  LogOut,
  Menu,
  X,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onNewNote: () => void;
  className?: string;
}

const sidebarItems = [
  {
    id: 'home',
    label: 'Início',
    icon: Home,
    description: 'Visão geral das notas'
  },
  {
    id: 'create',
    label: 'Nova Nota',
    icon: PlusCircle,
    description: 'Criar uma nova nota',
    action: true
  },
  {
    id: 'notes',
    label: 'Minhas Notas',
    icon: FileText,
    description: 'Histórico de notas criadas'
  },
  {
    id: 'tasks',
    label: 'Tarefas',
    icon: CheckSquare,
    description: 'Gerenciar tarefas'
  },
  {
    id: 'settings',
    label: 'Configurações',
    icon: Settings,
    description: 'Configurações do aplicativo'
  },
  {
    id: 'profile',
    label: 'Perfil',
    icon: User,
    description: 'Gerenciar conta'
  }
];

export function Sidebar({ currentView, onViewChange, onNewNote, className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleItemClick = (item: typeof sidebarItems[0]) => {
    if (item.action && item.id === 'create') {
      onNewNote();
    } else {
      onViewChange(item.id);
    }
    
    // Fechar sidebar no mobile após seleção
    setIsMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-bold text-sm">Any Note</h2>
                <p className="text-xs text-muted-foreground">v2.0</p>
              </div>
            </motion.div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex h-8 w-8 p-0"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* User Info */}
      {!isCollapsed && user && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border-b border-border/50 bg-muted/30"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user.username}</p>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
            <Badge variant="secondary" className="text-xs">
              Pro
            </Badge>
          </div>
        </motion.div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 p-2 space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <motion.div
              key={item.id}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start h-10 px-3",
                  isCollapsed ? "px-2" : "px-3",
                  isActive && "bg-primary/10 text-primary border-primary/20"
                )}
                onClick={() => handleItemClick(item)}
              >
                <Icon className={cn("h-4 w-4", isCollapsed ? "mx-auto" : "mr-3")} />
                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Button>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-border/50">
        <motion.div whileTap={{ scale: 0.98 }}>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start h-10 text-destructive hover:text-destructive hover:bg-destructive/10",
              isCollapsed ? "px-2" : "px-3"
            )}
            onClick={handleLogout}
          >
            <LogOut className={cn("h-4 w-4", isCollapsed ? "mx-auto" : "mr-3")} />
            {!isCollapsed && <span className="text-sm font-medium">Sair</span>}
          </Button>
        </motion.div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="sm"
        className="lg:hidden fixed top-4 left-4 z-50 h-10 w-10 p-0 bg-background/80 backdrop-blur-sm border border-border/50"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 64 : 280 }}
        className={cn(
          "hidden lg:flex flex-col bg-background/95 backdrop-blur-sm border-r border-border/50 h-screen sticky top-0",
          className
        )}
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="lg:hidden fixed left-0 top-0 z-50 w-72 h-screen bg-background/95 backdrop-blur-sm border-r border-border/50"
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}