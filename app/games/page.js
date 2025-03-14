import HeaderIndividualPage from '@/components/HeaderIndividualPage';
import Spinner from '@/components/ui/Spinner';

import { Suspense } from 'react';
import GameRows from './GameRows';

function Games({ href }) {
  return (
    <div>
      <HeaderIndividualPage href={href} />
      <Suspense fallback={<Spinner />}>
        <GameRows />
      </Suspense>
    </div>
  );
}

export default Games;
