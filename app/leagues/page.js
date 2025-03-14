import HeaderIndividualPage from '@/components/HeaderIndividualPage';

import { Suspense } from 'react';
import { LeaguesData } from './LeaguesData';

import AddItemButton from '@/components/ui/AddItemButton';
import Spinner from '@/components/ui/Spinner';

function Leagues({ href }) {
  return (
    <>
      <HeaderIndividualPage href={href} />
      <Suspense fallback={<Spinner />}>
        <LeaguesData />
      </Suspense>
      <AddItemButton table="leagues" label="Add League" />
    </>
  );
}

export default Leagues;
