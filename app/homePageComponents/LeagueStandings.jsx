'use client';
import Table from '@/components/Table';
import Spinner from '@/components/ui/Spinner';

import { standingsColumns } from '@/lib/tables';
import { useUniversalData } from '@/hooks/useUniversalData';

function LeagueStandings() {
  const { data, isLoading, error } = useUniversalData({
    table: 'standings',
    filter: {},
  });
  const columns = standingsColumns;

  if (isLoading) return <Spinner />;
  if (error) return <p className="text-red-500">Error loading data</p>;

  return <Table columns={columns} data={data}></Table>;
}

export default LeagueStandings;
