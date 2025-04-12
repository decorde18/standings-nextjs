'use client';
import DragDropForm from '@/components/ui/DragDropForm';
import { useUniversalData } from '@/hooks/useUniversalData';
import { useFilter } from '@/providers/FilterProvider';
import Error from '../error';
import Spinner from '@/components/ui/Spinner';

function TieBreaker() {
  const { dlid } = useFilter();
  const {
    data: options,
    isLoading,
    error,
  } = useUniversalData({
    table: 'tiebreaker_categories',
  });
  const {
    data: initialSelected,
    isLoading: isLoadingSelected,
    error: isErrorSelected,
  } = useUniversalData({
    table: 'tiebreakers',
    filter: { division_id: dlid },
  });
  if (isLoading || isLoadingSelected) return <Spinner />;
  if (error || isErrorSelected)
    return (
      <Error name="TIEBREAKER ERROR " message="ERROR GETTING TIEBREAKERS" />
    );
  console.log(initialSelected);
  const sortedOptions = options.sort((a, b) => a.name - b.name);
  const selectedTiebreakers = initialSelected.map((item) => {
    const { tiebreaker_id, category_name, ...rest } = item;
    return { id: tiebreaker_id, name: category_name, ...rest };
  });
  return (
    <DragDropForm
      options={sortedOptions}
      initialSelected={selectedTiebreakers}
    ></DragDropForm>
  );
}

export default TieBreaker;
