'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pin, Edit, Trash2, Calendar, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Note } from '@/types/note';
import { ANIMATIONS } from '@/constants';
import { cn } from '@/lib/utils';
import { getContrastTextClasses } from '@/utils/color-contrast';

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onView?: (note: Note) => void;
}

export function NoteCard({ note, onDelete, onTogglePin, onView }: NoteCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  // Obter as classes de texto com contraste adequado
  const textColors = getContrastTextClasses(note.color || 'bg-background');

  return (
    <motion.div
      layout
      {...ANIMATIONS.FADE_IN}
      whileHover={{ y: -2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card 
        className={cn(
          "cursor-pointer transition-all duration-200 hover:shadow-lg",
          note.color || "bg-background",
          note.isPinned && "ring-2 ring-primary/20"
        )}
        onClick={() => onView?.(note)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <h3 className={cn("font-semibold text-lg line-clamp-2 flex-1 font-serif", textColors.titleClasses)}>
              {note.title || 'Nota sem título'}
            </h3>
            <div className="flex items-center space-x-1 ml-2">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 opacity-0 transition-opacity",
                  (isHovered || note.isPinned) && "opacity-100"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin(note.id);
                }}
              >
                <Pin 
                  className={cn(
                    "h-4 w-4",
                    note.isPinned ? "fill-current text-primary" : textColors.iconClasses
                  )} 
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 opacity-0 transition-opacity text-destructive",
                  isHovered && "opacity-100"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(note.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {note.content && (
            <p className={cn("text-sm line-clamp-4", textColors.contentClasses)}>
              {truncateContent(note.content)}
            </p>
          )}

          {note.tags.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              <Tag className={cn("h-3 w-3", textColors.iconClasses)} />
              {note.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {note.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{note.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          <div className={cn("flex items-center justify-between text-xs", textColors.mutedClasses)}>
            <div className="flex items-center gap-1">
              <Calendar className={cn("h-3 w-3", textColors.iconClasses)} />
              <span>Criado: {formatDate(note.createdAt)}</span>
            </div>
            {note.updatedAt.getTime() !== note.createdAt.getTime() && (
              <div className="flex items-center gap-1">
                <Edit className={cn("h-3 w-3", textColors.iconClasses)} />
                <span>Editado: {formatDate(note.updatedAt)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}