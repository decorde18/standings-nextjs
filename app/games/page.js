import HeaderIndividualPage from '@/components/HeaderIndividualPage';
import Spinner from '@/components/ui/Spinner';

import { Suspense } from 'react';
import GameRows from './GameRows';
import AddItemButton from '@/components/ui/AddItemButton';

function Games({ href }) {
  return (
    <div>
      <HeaderIndividualPage href={href} />
      <Suspense fallback={<Spinner />}>
        <GameRows />
        <AddItemButton table="games" label="Add Game" />
      </Suspense>
    </div>
  );
}

export default Games;


