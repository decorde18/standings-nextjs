import Details from '@/components/ui/Details';
import Form from '@/components/ui/Form';

function UpdateLeague({ isUpdating, setIsUpdating, league, tableFields }) {
  //todo redirect path works but doesn't setIsUpdating to false.
  return isUpdating ? (
    <Form
      fields={tableFields.leaguesColumns.filter((f) => f.editable !== false)}
      table="leagues"
      initialData={league}
      buttonText="Update"
      onSubmit={() => setIsUpdating(false)}
    />
  ) : (
    <Details
      label="League"
      columns="leaguesColumns"
      data={league}
      handleChange={() => setIsUpdating((prev) => !prev)}
    />
  );
}

export default UpdateLeague;
