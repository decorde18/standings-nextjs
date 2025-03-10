import Form from '@/components/ui/Form';
import * as tableFields from '@/lib/tables';

function page({ params }) {
  const table = params.tableItem;
  const fields = tableFields[table].filter((field) => field.editable !== false);

  return (
    <div className="flex-centered-columns">
      <div className="center-column">
        <Form fields={fields} table={table} buttonText="Save" />
      </div>
    </div>
  );
}
export default page;
