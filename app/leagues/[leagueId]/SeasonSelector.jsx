import Table from '@/components/Table';
import AddItemButton from '@/components/ui/AddItemButton';

function SeasonSelector({
  isUpdating,
  tableFields,
  seasons,
  effectiveSeason,
  setSeason,
}) {
  return (
    !isUpdating && (
      <>
        <Table
          columns={tableFields.seasonsColumns}
          data={seasons}
          handleRow={(rowId) => setSeason(rowId)}
          rowsPerPage={3}
          selected={effectiveSeason}
        />
        <AddItemButton table="seasons" label="Add Season" />;
      </>
    )
  );
}

export default SeasonSelector;
