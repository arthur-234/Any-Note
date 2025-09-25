/**
 * Função para determinar se uma cor de fundo requer texto escuro ou claro
 * baseado no contraste e legibilidade
 */

export function getTextColorForBackground(bgColor: string): {
  titleColor: string;
  contentColor: string;
  mutedColor: string;
  iconColor: string;
} {
  // Extrair a cor base do bgColor (remover dark: e outras classes)
  const baseColor = bgColor.split(' ')[0];
  
  // Mapeamento das cores de fundo para cores de texto apropriadas
  const colorMap: Record<string, {
    titleColor: string;
    contentColor: string;
    mutedColor: string;
    iconColor: string;
  }> = {
    'bg-background': {
      titleColor: 'text-foreground',
      contentColor: 'text-muted-foreground',
      mutedColor: 'text-muted-foreground',
      iconColor: 'text-muted-foreground'
    },
    'bg-yellow-100': {
      titleColor: 'text-yellow-900',
      contentColor: 'text-yellow-800',
      mutedColor: 'text-yellow-700',
      iconColor: 'text-yellow-600'
    },
    'bg-green-100': {
      titleColor: 'text-green-900',
      contentColor: 'text-green-800',
      mutedColor: 'text-green-700',
      iconColor: 'text-green-600'
    },
    'bg-blue-100': {
      titleColor: 'text-blue-900',
      contentColor: 'text-blue-800',
      mutedColor: 'text-blue-700',
      iconColor: 'text-blue-600'
    },
    'bg-purple-100': {
      titleColor: 'text-purple-900',
      contentColor: 'text-purple-800',
      mutedColor: 'text-purple-700',
      iconColor: 'text-purple-600'
    },
    'bg-pink-100': {
      titleColor: 'text-pink-900',
      contentColor: 'text-pink-800',
      mutedColor: 'text-pink-700',
      iconColor: 'text-pink-600'
    },
    'bg-orange-100': {
      titleColor: 'text-orange-900',
      contentColor: 'text-orange-800',
      mutedColor: 'text-orange-700',
      iconColor: 'text-orange-600'
    }
  };

  return colorMap[baseColor] || colorMap['bg-background'];
}

/**
 * Função para obter cores de texto para o modo escuro
 */
export function getTextColorForBackgroundDark(bgColor: string): {
  titleColor: string;
  contentColor: string;
  mutedColor: string;
  iconColor: string;
} {
  // Extrair a cor base do bgColor
  const baseColor = bgColor.split(' ')[0];
  
  // Para o modo escuro, usamos cores mais claras das mesmas famílias
  const darkColorMap: Record<string, {
    titleColor: string;
    contentColor: string;
    mutedColor: string;
    iconColor: string;
  }> = {
    'bg-background': {
      titleColor: 'dark:text-foreground',
      contentColor: 'dark:text-muted-foreground',
      mutedColor: 'dark:text-muted-foreground',
      iconColor: 'dark:text-muted-foreground'
    },
    'bg-yellow-100': {
      titleColor: 'dark:text-yellow-100',
      contentColor: 'dark:text-yellow-200',
      mutedColor: 'dark:text-yellow-300',
      iconColor: 'dark:text-yellow-400'
    },
    'bg-green-100': {
      titleColor: 'dark:text-green-100',
      contentColor: 'dark:text-green-200',
      mutedColor: 'dark:text-green-300',
      iconColor: 'dark:text-green-400'
    },
    'bg-blue-100': {
      titleColor: 'dark:text-blue-100',
      contentColor: 'dark:text-blue-200',
      mutedColor: 'dark:text-blue-300',
      iconColor: 'dark:text-blue-400'
    },
    'bg-purple-100': {
      titleColor: 'dark:text-purple-100',
      contentColor: 'dark:text-purple-200',
      mutedColor: 'dark:text-purple-300',
      iconColor: 'dark:text-purple-400'
    },
    'bg-pink-100': {
      titleColor: 'dark:text-pink-100',
      contentColor: 'dark:text-pink-200',
      mutedColor: 'dark:text-pink-300',
      iconColor: 'dark:text-pink-400'
    },
    'bg-orange-100': {
      titleColor: 'dark:text-orange-100',
      contentColor: 'dark:text-orange-200',
      mutedColor: 'dark:text-orange-300',
      iconColor: 'dark:text-orange-400'
    }
  };

  return darkColorMap[baseColor] || darkColorMap['bg-background'];
}

/**
 * Função combinada que retorna as classes de texto para ambos os modos
 */
export function getContrastTextClasses(bgColor: string): {
  titleClasses: string;
  contentClasses: string;
  mutedClasses: string;
  iconClasses: string;
} {
  const lightColors = getTextColorForBackground(bgColor);
  const darkColors = getTextColorForBackgroundDark(bgColor);

  return {
    titleClasses: `${lightColors.titleColor} ${darkColors.titleColor}`,
    contentClasses: `${lightColors.contentColor} ${darkColors.contentColor}`,
    mutedClasses: `${lightColors.mutedColor} ${darkColors.mutedColor}`,
    iconClasses: `${lightColors.iconColor} ${darkColors.iconColor}`
  };
}