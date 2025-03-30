'use client';

import Empty from '@/app/empty';
import Error from '@/app/error';
import DragDropForm from '@/components/ui/DragDropForm';
import { useUniversalData } from '@/hooks/useUniversalData';

function TieBreakers() {
  const { isLoading, error, data } = useUniversalData({
    table: 'tiebreakers',
  });
  const {
    isLoading: isLoadingCategories,
    error: errorCategories,
    data: categories,
  } = useUniversalData({
    table: 'tiebreaker_categories',
  });

  // TODO: Tiebreakers view needs o include information from tiebreaker categories . this won't work right now because inititalSelected won't find these values
  if (isLoading || isLoadingCategories) return;
  if (error)
    return (
      <Error
        error={error}
        name="Tie Breaker Error"
        message="There is an issue with the Tie Breakers"
      />
    );
  // TODO: This logic neds to be adjusted so we have a new form
  if (!data.length)
    return (
      <Empty
        name="No Tie Breaker Information"
        message="There are no Tie Breakers"
      />
    );

  const initialSelected = data.map((item) => ({
    id: item.id,
    name: item.name,
  }));

  const options = categories.map((item) => ({ id: item.id, name: item.name }));
  return (
    <DragDropForm
      options={options}
      initialSelected={initialSelected}
    ></DragDropForm>
  );
}
export default TieBreakers;
