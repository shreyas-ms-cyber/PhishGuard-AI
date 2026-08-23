import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('phishguard-theme');
    return saved || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    // Remove old theme class
    root.classList.remove('dark', 'light');
    // Add new theme class for Tailwind
    root.classList.add(theme);
    // Set data attribute for CSS variables
    root.setAttribute('data-theme', theme);
    localStorage.setItem('phishguard-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const value = { theme, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
