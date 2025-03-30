'use client';
import { useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import { useUniversalData } from '@/hooks/useUniversalData';
import { gamesColumns } from '@/lib/tables';

import Table from '@/components/Table';
import Error from '@/app/error';
import Empty from '@/app/empty';

function GameRows() {
  const queryClient = useQueryClient();

  const searchParams = useSearchParams();
  const dlid = searchParams.get('dlid');
  const league = searchParams.get('league');
  const season = searchParams.get('season');

  const {
    isLoading,
    error,
    data: games,
    delete: deleteGame,
  } = useUniversalData({
    table: 'games',
    filter: dlid
      ? { division_league_id: dlid }
      : league
        ? season
          ? { league_id: league, season_id: season }
          : { league_id: league }
        : undefined,
    sort: 'game_date',
  });

  const gameTableColumns = gamesColumns.filter(
    (column) => column.display !== false && column.scoreDisplay !== false,
  );
  async function handleDeleteGame(rowId) {
    const gameId = games.find((game) => game.id === rowId)?.id;

    try {
      await deleteGame({ table: 'games', id: gameId });

      // Manually invalidate both queries to trigger a re-fetch
      await queryClient.invalidateQueries({ queryKey: ['games'] });
    } catch (err) {
      console.error('Delete Error:', err);
    }
  }

  if (isLoading) return null;
  if (error)
    return (
      <Error
        error={error}
        name="Games"
        message="There is an issue with the Games Data"
      />
    );

  if (!games.length)
    return (
      <Empty
        name="No Games Scheduled"
        message="There areno games scheduled for this league/season/division "
      />
    );

  return (
    <div className="flex-centered-columns">
      <div className="center-column">
        <Table
          className="center-column"
          columns={gameTableColumns}
          data={games}
          handleDelete={handleDeleteGame}
        />
      </div>
    </div>
  );
}

export default GameRows;
