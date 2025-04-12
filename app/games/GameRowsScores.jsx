'use client';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useUniversalData } from '@/hooks/useUniversalData';
import { gamesColumns } from '@/lib/tables';

import Error from '../error';
import Table from '@/components/Table';
import Empty from '../empty';

import Button from '@/components/ui/Button';

function GameRowsScores({ params }) {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();

  const dlid = searchParams.get('dlid');
  const league = searchParams.get('league');
  const season = searchParams.get('season');
  const [showScores, setShowScores] = useState(true);

  const {
    isLoading,
    error,
    data: games,
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
  const {
    isLoading: isLoadingScores,
    error: errorScores,
    data: scores,
    update,
    create,
    delete: deleteRecord,
    delete: deleteGame,
  } = useUniversalData({
    table: 'scores',
  });

  const gameTableColumns = gamesColumns.filter(
    (column) => column.display !== false,
  );
  function selectRow(rowId) {
    router.push(`/games/${rowId}`);
  }
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
  async function handleDeleteScore(rowId) {
    const gameId = games.find((game) => game.id === rowId)?.id;
    const scoreRecord = scores.find((score) => score.game_id === gameId);
    const scoresId = scoreRecord?.score_id;
    if (!scoresId) return console.warn('No score found for this game');

    try {
      await deleteRecord({ table: 'scores', id: scoresId });
      // console.log('Scores deleted successfully!');
      // Manually invalidate both queries to trigger a re-fetch
      await queryClient.invalidateQueries({ queryKey: ['scores'] });
      await queryClient.invalidateQueries({ queryKey: ['games'] });
    } catch (err) {
      console.error('Delete Error:', err);
    }
  }
  const handleScoreInput = async ({ name, value, rowId }) => {
    const gameId = games.find((game) => game.id === rowId)?.id;
    const existingScore = scores.find((score) => score.id === gameId);
    const scoresId = existingScore?.score_id;
    const currentValue = existingScore?.[name];

    // Prevent unnecessary API calls if value hasn't changed
    if (currentValue == value) return;
    if (scoresId) {
      try {
        await update({
          table: 'scores',
          id: scoresId,
          data: { [name]: value },
        });
        // console.log('Score updated successfully!');
      } catch (err) {
        console.error('Update Error:', err);
      }
    } else if (value !== '') {
      // Prevents re-creating a deleted score if input is empty
      try {
        await create({
          table: 'scores',
          data: { game_id: gameId, [name]: value },
        });
        // console.log('Score created successfully!');
      } catch (err) {
        console.error('Create Error:', err);
      }
    }
  };

  if (isLoading || isLoadingScores) return null;
  if (error || errorScores)
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
  const showColumns = gamesColumns.map((column) => {
    if (column.name === 'home_score' || column.name === 'away_score') {
      return { ...column, display: showScores };
    } else return { ...column };
  });
  return (
    <div className="flex-centered-columns">
      <div className="center-column">
        <Button
          onClick={() => setShowScores((prev) => !prev)}
          name="showScores"
        >
          {showScores ? 'HIDE SCORES' : 'SHOW SCORES'}
        </Button>
        <Table
          className="center-column"
          columns={showColumns}
          data={games}
          handleDelete={showScores ? handleDeleteScore : handleDeleteGame}
          handleInput={handleScoreInput}
          rowsPerPage={20}
          handleRow={selectRow}
        />
      </div>
    </div>
  );
}

export default GameRowsScores;
