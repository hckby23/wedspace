/**
 * WedSpace Theme Configuration
 * 
 * This file defines the color palette and theme variables for the WedSpace platform.
 * The theme uses a red + mustard color scheme with appropriate dark mode variants.
 */

export const themeColors = {
  // Primary colors
  primary: {
    DEFAULT: '#D32F2F', // Red
    foreground: '#FFFFFF',
    50: '#FFEBEE',
    100: '#FFCDD2',
    200: '#EF9A9A',
    300: '#E57373',
    400: '#EF5350',
    500: '#D32F2F', // Base red
    600: '#C62828',
    700: '#B71C1C',
    800: '#8E1515',
    900: '#5D0E0E',
  },
  
  // Secondary colors (mustard)
  secondary: {
    DEFAULT: '#F9A825', // Mustard
    foreground: '#000000',
    50: '#FFF8E1',
    100: '#FFECB3',
    200: '#FFE082',
    300: '#FFD54F',
    400: '#FFCA28',
    500: '#F9A825', // Base mustard
    600: '#F57F17',
    700: '#EF6C00',
    800: '#D84315',
    900: '#BF360C',
  },
  
  // Background colors
  background: {
    DEFAULT: '#FFFFFF',
    paper: '#F5F5F5',
    subtle: '#FAFAFA',
  },
  
  // Text colors
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#9E9E9E',
    hint: '#BDBDBD',
  },
  
  // Dark mode colors
  dark: {
    background: {
      DEFAULT: '#121212',
      paper: '#1E1E1E',
      subtle: '#2D2D2D',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
      disabled: '#6C6C6C',
      hint: '#505050',
    },
    primary: {
      DEFAULT: '#FF5252', // Brighter red for dark mode
      foreground: '#FFFFFF',
    },
    secondary: {
      DEFAULT: '#FFD740', // Brighter mustard for dark mode
      foreground: '#000000',
    },
  },
  
  // Semantic colors
  success: {
    DEFAULT: '#4CAF50',
    foreground: '#FFFFFF',
  },
  warning: {
    DEFAULT: '#FF9800',
    foreground: '#000000',
  },
  error: {
    DEFAULT: '#F44336',
    foreground: '#FFFFFF',
  },
  info: {
    DEFAULT: '#2196F3',
    foreground: '#FFFFFF',
  },
};

// Transition settings for smooth animations
export const transitions = {
  default: 'all 0.3s ease',
  fast: 'all 0.15s ease',
  slow: 'all 0.5s ease',
};

// Border radius settings
export const borderRadius = {
  sm: '0.125rem',
  DEFAULT: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
};

// Shadow settings
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',
};
