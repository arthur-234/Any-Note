'use client';

import { Filter, SortAsc, SortDesc, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SORT_OPTIONS } from '@/constants';

interface NotesFiltersProps {
  allTags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearTags: () => void;
  sortBy: 'createdAt' | 'updatedAt' | 'title';
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: 'createdAt' | 'updatedAt' | 'title') => void;
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  totalNotes: number;
  filteredCount: number;
}

export function NotesFilters({
  allTags,
  selectedTags,
  onTagToggle,
  onClearTags,
  sortBy,
  sortOrder,
  onSortChange,
  onSortOrderChange,
  totalNotes,
  filteredCount,
}: NotesFiltersProps) {
  const currentSortOption = SORT_OPTIONS.find(option => option.value === sortBy);

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Informações e Tags Selecionadas */}
          <div className="flex items-center gap-4 flex-1">
            <div className="text-sm text-muted-foreground">
              {filteredCount} de {totalNotes} notas
            </div>
            
            {selectedTags.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Filtros:</span>
                <div className="flex gap-1">
                  {selectedTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => onTagToggle(tag)}
                    >
                      {tag} <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearTags}
                  className="text-xs"
                >
                  Limpar filtros
                </Button>
              </div>
            )}
          </div>

          {/* Controles de Filtro e Ordenação */}
          <div className="flex items-center gap-2">
            {/* Filtro por Tags */}
            {allTags.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Tags
                    {selectedTags.length > 0 && (
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {selectedTags.length}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Filtrar por tags</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {allTags.map((tag) => (
                    <DropdownMenuItem
                      key={tag}
                      onClick={() => onTagToggle(tag)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{tag}</span>
                        {selectedTags.includes(tag) && (
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Ordenação */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  {sortOrder === 'asc' ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  )}
                  {currentSortOption?.label}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {SORT_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => onSortChange(option.value as any)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{option.label}</span>
                      {sortBy === option.value && (
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    {sortOrder === 'asc' ? (
                      <>
                        <SortDesc className="h-4 w-4" />
                        Decrescente
                      </>
                    ) : (
                      <>
                        <SortAsc className="h-4 w-4" />
                        Crescente
                      </>
                    )}
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}