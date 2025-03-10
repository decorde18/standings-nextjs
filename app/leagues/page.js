import HeaderIndividualPage from '@/components/HeaderIndividualPage';

import { Suspense } from 'react';
import { LeaguesData } from './LeaguesData';

import AddItemButton from '@/components/ui/AddItemButton';

function Leagues({ href }) {
  return (
    <>
      <HeaderIndividualPage href={href} />
      <Suspense>
        <LeaguesData />
      </Suspense>
      <AddItemButton table="leagues" label="Add League" />
    </>
  );
}

export default Leagues;
