'use client';

import { useState, useEffect } from 'react';
import { X, Save, Palette, Tag, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Note, NoteFormData } from '@/types/note';
import { NOTE_COLORS, APP_CONFIG } from '@/constants';
import { cn } from '@/lib/utils';

interface NoteEditorProps {
  note?: Note;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NoteFormData) => void;
  onUpdate?: (id: string, data: Partial<NoteFormData>) => void;
}

export function NoteEditor({ 
  note, 
  isOpen, 
  onClose, 
  onSave, 
  onUpdate 
}: NoteEditorProps) {
  const [formData, setFormData] = useState<NoteFormData>({
    title: '',
    content: '',
    tags: [],
    color: undefined,
  });
  const [newTag, setNewTag] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title,
        content: note.content,
        tags: note.tags,
        color: note.color,
      });
    } else {
      setFormData({
        title: '',
        content: '',
        tags: [],
        color: undefined,
      });
    }
  }, [note, isOpen]);

  const handleSave = () => {
    if (!formData.title.trim() && !formData.content.trim()) {
      return;
    }

    if (note && onUpdate) {
      onUpdate(note.id, formData);
    } else {
      onSave(formData);
    }
    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSave();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden flex flex-col bg-gradient-to-br from-background to-muted/20 border-2">
        <DialogHeader className="pb-6 border-b border-border/50">
          <DialogTitle className="text-2xl font-serif bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {note ? '✏️ Editar Nota' : '📝 Nova Nota'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 space-y-8 overflow-auto p-2">
          {/* Título */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Título
            </label>
            <Input
              placeholder="Digite o título da sua nota..."
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="text-xl font-code font-semibold border-2 border-border/50 rounded-xl px-4 py-3 bg-background/50 backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary transition-all duration-200 hover:border-primary/30"
              maxLength={APP_CONFIG.MAX_TITLE_LENGTH}
              onKeyPress={handleKeyPress}
            />
            <div className="text-xs text-muted-foreground flex justify-between items-center">
              <span>Use um título descritivo e claro</span>
              <span className={cn(
                "font-mono px-2 py-1 rounded-md",
                formData.title.length > APP_CONFIG.MAX_TITLE_LENGTH * 0.8 
                  ? "bg-destructive/10 text-destructive" 
                  : "bg-muted text-muted-foreground"
              )}>
                {formData.title.length}/{APP_CONFIG.MAX_TITLE_LENGTH}
              </span>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="space-y-3 flex-1">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Conteúdo
            </label>
            <Textarea
              placeholder="Escreva o conteúdo da sua nota aqui... 
              
💡 Dica: Use Ctrl+Enter para salvar rapidamente!"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="min-h-[350px] font-code text-base leading-relaxed border-2 border-border/50 rounded-xl px-4 py-4 bg-background/50 backdrop-blur-sm resize-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary transition-all duration-200 hover:border-primary/30"
              maxLength={APP_CONFIG.MAX_CONTENT_LENGTH}
            />
            <div className="text-xs text-muted-foreground flex justify-between items-center">
              <span>Organize suas ideias de forma clara e estruturada</span>
              <span className={cn(
                "font-mono px-2 py-1 rounded-md",
                formData.content.length > APP_CONFIG.MAX_CONTENT_LENGTH * 0.8 
                  ? "bg-destructive/10 text-destructive" 
                  : "bg-muted text-muted-foreground"
              )}>
                {formData.content.length}/{APP_CONFIG.MAX_CONTENT_LENGTH}
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Tags
            </label>
            <div className="bg-muted/30 rounded-xl p-4 border border-border/50 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 flex-1">
                  <Tag className="h-4 w-4 text-primary" />
                  <Input
                    placeholder="Digite uma tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    className="flex-1 font-code border-border/50 bg-background/50 focus-visible:ring-1 focus-visible:ring-primary/50"
                  />
                </div>
                <Button 
                  onClick={addTag} 
                  size="sm" 
                  className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4"
                  disabled={!newTag.trim() || formData.tags.includes(newTag.trim())}
                >
                  <Plus className="h-3 w-3" />
                  Adicionar
                </Button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">Tags adicionadas:</div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-all duration-200 font-code px-3 py-1 text-sm bg-primary/10 text-primary hover:bg-destructive/90 border border-primary/20"
                        onClick={() => removeTag(tag)}
                      >
                        #{tag} <X className="h-3 w-3 ml-2" />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {formData.tags.length === 0 && (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  Nenhuma tag adicionada ainda
                </div>
              )}
            </div>
          </div>

          {/* Seletor de Cor */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Cor da Nota
            </label>
            <div className="bg-muted/30 rounded-xl p-4 border border-border/50 space-y-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="gap-2 border-border/50 hover:border-primary/50 transition-all duration-200"
              >
                <Palette className="h-4 w-4" />
                {formData.color ? 'Alterar Cor' : 'Escolher Cor'}
                {formData.color && (
                  <div className={cn("w-4 h-4 rounded-full border border-border", formData.color)}></div>
                )}
              </Button>
              
              {showColorPicker && (
                <div className="space-y-3">
                  <div className="text-xs text-muted-foreground">Escolha uma cor para destacar sua nota:</div>
                  <div className="grid grid-cols-8 gap-3 p-4 bg-background/50 rounded-lg border border-border/30">
                    {NOTE_COLORS.map((color) => (
                      <button
                        key={color.name}
                        className={cn(
                          "w-10 h-10 rounded-full border-2 transition-all duration-200 hover:scale-110 focus:scale-110 focus:outline-none",
                          color.value,
                          formData.color === color.value
                            ? "border-primary scale-110 shadow-lg shadow-primary/25"
                            : "border-border hover:border-primary/50"
                        )}
                        onClick={() => setFormData(prev => ({ 
                          ...prev, 
                          color: prev.color === color.value ? undefined : color.value 
                        }))}
                        title={color.name}
                      />
                    ))}
                  </div>
                  {formData.color && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, color: undefined }))}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Remover cor
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex justify-between items-center pt-6 border-t border-border/50 bg-background/50 backdrop-blur-sm">
          <div className="text-sm text-muted-foreground font-code flex items-center gap-2">
            <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl</kbd>
            <span>+</span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd>
            <span>para salvar</span>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="border-border/50 hover:border-destructive/50 hover:text-destructive transition-all duration-200"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSave} 
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 shadow-lg shadow-primary/25"
              disabled={!formData.title.trim() && !formData.content.trim()}
            >
              <Save className="h-4 w-4" />
              {note ? 'Atualizar Nota' : 'Salvar Nota'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}