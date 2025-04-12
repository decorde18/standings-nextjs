import HeaderIndividualPage from '@/components/HeaderIndividualPage';
import Spinner from '@/components/ui/Spinner';

import { Suspense } from 'react';

import AddItemButton from '@/components/ui/AddItemButton';
import GameRowsScores from './GameRowsScores';

async function Games({ href, searchParams }) {
  const params = Object.entries(await searchParams)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  // TODO: how will we go about switching from schedule to scores
  return (
    <div>
      <HeaderIndividualPage href={href} />
      <Suspense fallback={<Spinner />}>
        <GameRowsScores />
        <AddItemButton
          table="games"
          label="Add Game"
          redirectPath={`/games?${params}`}
        />
      </Suspense>
    </div>
  );
}

export default Games;
