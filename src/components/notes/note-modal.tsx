'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Pin, Calendar, Edit, Tag, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Note } from '@/types';
import { NOTE_COLORS } from '@/constants';
import { getContrastTextClasses } from '@/utils/color-contrast';
import { cn } from '@/lib/utils';

interface NoteModalProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (note: Note) => void;
}

export function NoteModal({ note, isOpen, onClose, onEdit }: NoteModalProps) {
  if (!note) return null;

  const noteColor = NOTE_COLORS.find(color => color.value === note.color);
  const textColors = getContrastTextClasses(note.color || 'bg-background');

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(note);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative z-10 w-full max-w-2xl max-h-[90vh] mx-4"
          >
            <Card className={cn(
              "overflow-hidden shadow-2xl border-2",
              note.color || "bg-background",
              note.isPinned && "ring-2 ring-primary/20"
            )}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {note.isPinned && (
                        <Pin className={cn("h-5 w-5 fill-current", textColors.iconClasses)} />
                      )}
                      {noteColor && (
                        <div className="flex items-center gap-1">
                          <Palette className={cn("h-4 w-4", textColors.iconClasses)} />
                          <span className={cn("text-sm", textColors.mutedClasses)}>
                            {noteColor.name}
                          </span>
                        </div>
                      )}
                    </div>
                    <h1 className={cn(
                      "text-2xl font-bold font-serif mb-3 leading-tight",
                      textColors.titleClasses
                    )}>
                      {note.title || 'Nota sem título'}
                    </h1>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleEdit}
                      className={cn("hover:bg-black/10", textColors.iconClasses)}
                    >
                      <Edit className="h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClose}
                      className={cn("hover:bg-black/10", textColors.iconClasses)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Tags */}
                {note.tags.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className={cn("h-4 w-4", textColors.iconClasses)} />
                    {note.tags.map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="secondary" 
                        className="text-xs bg-black/10 hover:bg-black/20"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Content */}
                <div className="prose prose-sm max-w-none">
                  <div className={cn(
                    "whitespace-pre-wrap text-base leading-relaxed",
                    textColors.contentClasses
                  )}>
                    {note.content || 'Esta nota está vazia.'}
                  </div>
                </div>

                {/* Dates */}
                <div className={cn(
                  "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-4 border-t border-black/10 text-sm",
                  textColors.mutedClasses
                )}>
                  <div className="flex items-center gap-2">
                    <Calendar className={cn("h-4 w-4", textColors.iconClasses)} />
                    <span>Criado: {formatDate(note.createdAt)}</span>
                  </div>
                  {note.updatedAt.getTime() !== note.createdAt.getTime() && (
                    <div className="flex items-center gap-2">
                      <Edit className={cn("h-4 w-4", textColors.iconClasses)} />
                      <span>Editado: {formatDate(note.updatedAt)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}