'use client';

import { useRouter } from 'next/navigation';

import { useLeagueDetailsData } from '@/hooks/useLeagueDetails';

import Table from '@/components/Table';
import Spinner from '@/components/ui/Spinner';

import { leaguesColumns } from '@/lib/tables';

export function LeaguesData() {
  const router = useRouter();
  const { isLoading, error, leagues } = useLeagueDetailsData();

  function selectLeague(leagueId) {
    router.push(`/leagues/${leagueId}`);
  }

  if (isLoading) return <Spinner />;
  if (error)
    return (
      <Error
        error={error}
        name="Leagues"
        message="There is an issue with the Leagues Data"
      />
    );

  return (
    <div className="flex-centered-columns">
      <div className="center-column">
        <Table
          columns={leaguesColumns}
          data={leagues || []}
          handleRow={selectLeague}
        />
      </div>
    </div>
  );
}
