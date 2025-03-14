import HeaderIndividualPage from '@/components/HeaderIndividualPage';

import { TeamsData } from './TeamsData';
import Spinner from '@/components/ui/Spinner';
import { Suspense } from 'react';
import AddItemButton from '@/components/ui/AddItemButton';

function Games({ href }) {
  return (
    <>
      <HeaderIndividualPage href={href} />
      <Suspense fallback={<Spinner />}>
        <TeamsData href={href} />
      </Suspense>
      <AddItemButton table="teams" label="Add Team" />
    </>
  );
}

export default Games;
