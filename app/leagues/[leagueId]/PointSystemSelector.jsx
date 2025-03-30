'use client';
import Table from '@/components/Table';
import { useUniversalData } from '@/hooks/useUniversalData';
import { useState } from 'react';

function PointSystemSelector({ tableFields, dlid, update }) {
  const { isLoading, error, data } = useUniversalData({
    table: 'point_system',
  });
  const [selectedPointSystem, setSelectedPointSystem] = useState(
    dlid.point_system_id,
  );

  async function handleSelectPointSystem(rowId) {
    setSelectedPointSystem(rowId);
    await update({
      table: 'divisions_leagues',
      id: dlid.id,
      data: { point_system_id: +rowId },
    });
  }

  if (isLoading) return;
  if (error)
    return (
      <Error
        error={error}
        name="Point System Error"
        message="There is an issue with the Point System"
      />
    );

  if (!data.length)
    return (
      <Empty
        name="No Point System Information"
        message="There is no Point System"
      />
    );
  return (
    <Table
      columns={tableFields.point_systemColumns}
      data={data}
      handleRow={handleSelectPointSystem}
      rowsPerPage={6}
      selected={selectedPointSystem}
    />
  );
}

export default PointSystemSelector;
