'use client';

import Table from '@/components/Table';
import Spinner from '@/components/ui/Spinner';
import { leaguesColumns } from '@/lib/tables';
import { useUniversalData } from '@/hooks/useUniversalData';

export function LeaguesData() {
  const {
    data: leagues,
    isLoading,
    error,
  } = useUniversalData({ table: 'leagues' });

  if (isLoading) return <Spinner />;
  if (error) return <p className="text-red-500">Error loading data</p>;

  return (
    <div className="flex-centered-columns">
      <div className="center-column">
        <Table columns={leaguesColumns} data={leagues || []} />
      </div>
    </div>
  );
}
