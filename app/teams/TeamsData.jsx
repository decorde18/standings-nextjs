'use client';
import Table from '@/components/Table';
import Spinner from '@/components/ui/Spinner';

import { teamsColumns } from '@/lib/tables';
import { useUniversalData } from '@/hooks/useUniversalData';

export function TeamsData() {
  const {
    data: teams,
    isLoading,
    error,
  } = useUniversalData({ table: 'teams' });

  if (isLoading) return <Spinner />;
  if (error) return <p className="text-red-500">Error loading data</p>;

  return (
    <div className="flex-centered-columns">
      <div className="center-column">
        <Table columns={teamsColumns} data={teams} />
      </div>
    </div>
  );
}
