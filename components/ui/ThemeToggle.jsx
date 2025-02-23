// components/ui/ThemeToggle.js
'use client';

import { useState, useEffect } from 'react';
import styles from '../../styles/ThemeToggle.module.css';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    return typeof window !== 'undefined' &&
      window.localStorage.getItem('theme') === 'dark'
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <button
      className={styles.themeToggle}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
