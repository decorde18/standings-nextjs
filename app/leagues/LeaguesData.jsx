import Table from '@/components/Table';
import Spinner from '@/components/ui/Spinner';
import { getData } from '@/lib/data-services';
import { leaguesColumns } from '@/lib/tables';
import { Suspense } from 'react';

export async function LeaguesData() {
  const leagues = await getData('leaguesView');

  return (
    <Suspense fallback={<Spinner />}>
      <Table columns={leaguesColumns} data={leagues} />
    </Suspense>
  );
}
