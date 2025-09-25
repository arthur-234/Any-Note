'use client';

import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { APP_CONFIG } from '@/constants';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onNewNote: () => void;
}

export function Header({ searchTerm, onSearchChange, onNewNote }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6 w-full">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold font-serif bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {APP_CONFIG.APP_NAME}
          </h1>
        </div>

        <div className="flex items-center space-x-4 flex-1 max-w-md mx-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar notas..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button onClick={onNewNote} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Nota
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}