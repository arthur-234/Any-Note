export const NOTE_COLORS = [
  { name: 'Default', value: 'bg-background', hex: '#ffffff', darkValue: 'dark:bg-background' },
  { name: 'Yellow', value: 'bg-yellow-100 dark:bg-yellow-900/30', hex: '#fef3c7', darkValue: 'dark:bg-yellow-900/30' },
  { name: 'Green', value: 'bg-green-100 dark:bg-green-900/30', hex: '#dcfce7', darkValue: 'dark:bg-green-900/30' },
  { name: 'Blue', value: 'bg-blue-100 dark:bg-blue-900/30', hex: '#dbeafe', darkValue: 'dark:bg-blue-900/30' },
  { name: 'Purple', value: 'bg-purple-100 dark:bg-purple-900/30', hex: '#f3e8ff', darkValue: 'dark:bg-purple-900/30' },
  { name: 'Pink', value: 'bg-pink-100 dark:bg-pink-900/30', hex: '#fce7f3', darkValue: 'dark:bg-pink-900/30' },
  { name: 'Orange', value: 'bg-orange-100 dark:bg-orange-900/30', hex: '#fed7aa', darkValue: 'dark:bg-orange-900/30' },
] as const;

export const STORAGE_KEYS = {
  NOTES: 'notes-app-notes',
  THEME: 'notes-app-theme',
  PREFERENCES: 'notes-app-preferences',
} as const;

export const APP_CONFIG = {
  APP_NAME: 'Notes App',
  VERSION: '1.0.0',
  MAX_TITLE_LENGTH: 100,
  MAX_CONTENT_LENGTH: 10000,
  AUTO_SAVE_DELAY: 1000, // ms
} as const;

export const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Data de Criação' },
  { value: 'updatedAt', label: 'Última Modificação' },
  { value: 'title', label: 'Título' },
] as const;

export const ANIMATIONS = {
  FADE_IN: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.2 }
  },
  SCALE_IN: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2 }
  }
} as const;