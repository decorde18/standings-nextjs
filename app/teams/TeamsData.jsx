'use client';
import Table from '@/components/Table';
import Spinner from '@/components/ui/Spinner';

import { teamsColumns } from '@/lib/tables';
import { useUniversalData } from '@/lib/useUniversalData';
import { Suspense } from 'react';

export function TeamsData() {
  const {
    data: teams,
    isLoading,
    error,
  } = useUniversalData({ table: 'teams' });

  if (isLoading) return <Spinner />;
  if (error) return <p className="text-red-500">Error loading data</p>;

  return (
    <Suspense fallback={<Spinner />}>
      <Table columns={teamsColumns} data={teams} />
    </Suspense>
  );
}
