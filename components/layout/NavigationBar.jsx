// components/layout/NavigationBar.js
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/components/NavigationBar.module.css';
import { routes } from '@/lib/routes';
import NavLink from './NavLink';
import FilterBar from './FilterBar';
import { useSearchParams } from 'next/navigation';

export default function NavigationBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const searchParams = useSearchParams();
  const queryString = new URLSearchParams(searchParams).toString(); // Convert queryParams to string

  return (
    <>
      <nav className={styles.nav}>
        {/* Logo with Animation */}
        <motion.div
          className={styles.logoContainer}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <NavLink href="/">
            <Image
              src="/icon.png"
              alt="Logo"
              width={50}
              height={50}
              className={styles.logo}
              priority
            />
          </NavLink>
        </motion.div>

        {/* Centered Navigation Links */}
        <nav className={styles.navCenter}>
          <ul>
            {routes.map((page) => (
              <li key={page.href} className={styles.navItem}>
                <NavLink href={`${page.href}?${queryString}`}>
                  {page.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Dropdown Button */}
        <button
          className={styles.menuButton}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className={styles.dropdownMenu}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Link className={styles.dropdownItem} href="/settings">
                Settings
              </Link>
              <Link className={styles.dropdownItem} href="/profile">
                Profile
              </Link>
              <Link className={styles.dropdownItem} href="/logout">
                Logout
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <FilterBar />
    </>
  );
}
