import Form from '@/components/ui/Form';
import * as tableFields from '@/lib/tables';

async function page({ params }) {
  const table = await params.tableItem;
  const fields = tableFields[`${table}Columns`].filter(
    (field) => field.editable !== false
  );

  return (
    <div className="flex-centered-columns">
      <div className="center-column">
        <Form fields={fields} table={table} buttonText="Save" />
      </div>
    </div>
  );
}
export default page;
