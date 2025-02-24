// components/ui/AnimatedTitle.js
'use client';

import { motion } from 'framer-motion';
import styles from '@/styles/AnimatedTitle.module.css';

export default function AnimatedTitle({ text }) {
  return (
    <motion.h1
      className={styles.title}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {text}
    </motion.h1>
  );
}
