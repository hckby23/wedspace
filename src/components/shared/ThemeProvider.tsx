import React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

/**
 * WedSpace ThemeProvider
 * 
 * This component wraps the application with next-themes ThemeProvider
 * to provide consistent theming across the app with support for:
 * - Light mode
 * - Dark mode
 * - System preference
 * - Theme persistence
 * 
 * This provider uses the theme configuration from src/styles/theme.ts
 * and the Tailwind configuration for a cohesive red+mustard theme.
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
};

// Re-export the useTheme hook from next-themes for convenience
export { useTheme } from 'next-themes';