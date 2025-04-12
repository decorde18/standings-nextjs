'use client';

import Empty from '@/app/empty';
import Error from '@/app/error';
import DragDropForm from '@/components/ui/DragDropForm';
import { useUniversalData } from '@/hooks/useUniversalData';
import { useFilter } from '@/providers/FilterProvider';

function TieBreakers() {
  const { dlid } = useFilter();
  const {
    data: options,
    isLoading,
    error,
    create,
    update,
    delete: deleteItem,
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

  if (isLoading || isLoadingSelected) return;
  if (error || isErrorSelected)
    return (
      <Error
        error={error}
        name="Tie Breaker Error"
        message="There is an issue with the Tie Breakers"
      />
    );
  // // TODO: This logic neds to be adjusted so we have a new form
  // if (!initialSelected.length)
  //   return (
  //     <Empty
  //       name="No Tie Breaker Information"
  //       message="There are no Tie Breakers"
  //     />
  //   );
  const sortedOptions = options
    .map((item) => {
      const { id, ...rest } = item;
      return { category_id: id, ...rest };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
  const selectedTiebreakers = initialSelected
    .map((item) => {
      const { category_name, ...rest } = item;
      return { name: category_name, ...rest };
    })
    .sort((a, b) => a.priority - b.priority);
  return (
    <DragDropForm
      options={sortedOptions}
      initialSelected={selectedTiebreakers}
      create={create}
      update={update}
      deleteItem={deleteItem}
      table="tiebreakers"
      dlid={dlid}
      // redirectPath="/leagues"
    ></DragDropForm>
  );
}
export default TieBreakers;
