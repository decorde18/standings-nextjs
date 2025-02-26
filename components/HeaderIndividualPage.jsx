'use client';

import { usePathname } from 'next/navigation';

import AnimatedTitle from '@/components/ui/AnimatedTitle';
import { routes } from '@/lib/routes';

function HeaderIndividualPage(href) {
  const path = usePathname();
  const pageTitle = routes.find((route) => route.href === path).title;
  const pageDescription = routes.find(
    (route) => route.href === path
  ).description;
  return (
    <>
      <AnimatedTitle text={pageTitle} />
      <h2>{pageDescription}</h2>
    </>
  );
}

export default HeaderIndividualPage;
