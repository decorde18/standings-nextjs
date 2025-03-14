'use client';
import Table from '@/components/Table';
import Spinner from '@/components/ui/Spinner';

import { standingsColumns } from '@/lib/tables';
import { useUniversalData } from '@/hooks/useUniversalData';

const currentLeague = [
  { team: 'team', wins: 1, losses: 2, ties: 3, points: 5, gf: 2, ga: 5 },
];
const columns = standingsColumns;
const data = currentLeague;

function LeagueStandings() {
  const {
    data: leagues,
    isLoading,
    error,
  } = useUniversalData({ table: 'leagues' });
  if (isLoading) return <Spinner />;
  if (error) return <p className="text-red-500">Error loading data</p>;

  return <Table columns={columns} data={data}></Table>;
}

export default LeagueStandings;
