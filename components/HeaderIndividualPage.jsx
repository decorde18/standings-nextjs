'use client';

import { usePathname } from 'next/navigation';

import { routes } from '@/lib/routes';
import AnimatedTitle from '@/components/ui/AnimatedTitle';

function HeaderIndividualPage(href) {
  const path = usePathname();
  const pageTitle = routes.find((route) => route.href === path)?.title;
  const pageDescription = routes.find(
    (route) => route.href === path
  ).description;
  return (
    <>
      <AnimatedTitle text={pageTitle} />
      <div>{pageDescription}</div>
    </>
  );
}

export default HeaderIndividualPage;
