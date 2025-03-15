import ThemeToggle from '@/components/ui/ThemeToggle';

import NavigationBar from './NavigationBar';

function Header() {
  return (
    <>
      <NavigationBar />

      <ThemeToggle />
    </>
  );
}

export default Header;
