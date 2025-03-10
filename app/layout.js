// app/layout.js
import { Geist, Geist_Mono } from 'next/font/google';
import '@/styles/globals.css';
import styles from '@/styles/pages/Home.module.css';
import Header from '@/components/layout/Header';
import { Providers } from './Providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Standings',
  description: 'Updatable standings for your league/tournament',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${styles.pageContainer}`}
      >
        <Providers>
          <Header />
          <main className={styles.mainContainer}>{children}</main>
          <footer className={styles.footer}>
            <p>
              &copy; {new Date().getFullYear()} David Cordero de Jesus Soccer
            </p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
