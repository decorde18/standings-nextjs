'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import classes from '@/styles/components/navLink.module.css';

function NavLink({ href, children }) {
  const path = usePathname();
  const isActive = href === '/' ? path === '/' : path.startsWith(href);

  return (
    <Link
      href={href}
      className={isActive ? `${classes.active} ${classes.link}` : classes.link}
    >
      {children}
    </Link>
  );
}

export default NavLink;
