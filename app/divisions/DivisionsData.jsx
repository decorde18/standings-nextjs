'use client';

import Table from '@/components/Table';
import Spinner from '@/components/ui/Spinner';
import { divisionsColumns } from '@/lib/tables';
import { useUniversalData } from '@/hooks/useUniversalData';

export function DivisionsData() {
  const {
    data: divisions,
    isLoading,
    error,
  } = useUniversalData({ table: 'divisions' });

  if (isLoading) return <Spinner />;
  if (error) return <p className="text-red-500">Error loading data</p>;
  const columns = divisionsColumns.filter((column) => column.display !== false);

  return (
    <div className="flex-centered-columns">
      <div className="center-column">
        <Table columns={columns} data={divisions || []} />
      </div>
    </div>
  );
}
