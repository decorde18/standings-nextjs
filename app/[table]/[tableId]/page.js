'use client';
import { useState } from 'react';

import { useUniversalData } from '@/lib/useUniversalData';
import { use } from 'react';

import * as tableFields from '@/lib/tables';
import Form from '@/components/ui/Form';

import Spinner from '@/components/ui/Spinner';
import Details from '@/components/ui/Details';

import HeaderIndividualPage from '@/components/HeaderIndividualPage';

//todo make this dynamic
function RecordEdit({ params }) {
  const { tableId, table } = use(params); // Accessing params correctly now

  const fields = tableFields[table].filter((field) => field.editable !== false);

  const { isLoading, error, data } = useUniversalData({
    table,
    filter: { id: tableId },
  });

  const record = data && data.length > 0 ? data[0] : null; // Get the first item, or null if empty
  const [isUpdating, setIsUpdating] = useState(false);

  if (isLoading) return <Spinner />;
  if (error) return <p>Error fetching league data</p>;

  if (!record) return <p>No record found</p>;

  return (
    <>
      <HeaderIndividualPage
        title={record.name}
        description={record.description}
      />
      <div className="flex-centered-columns">
        <div className="center-column">
          {isUpdating ? (
            <Form
              fields={fields}
              table={table}
              initialData={record}
              buttonText="Update"
            />
          ) : (
            <div>
              <Details
                label={table}
                columns={`${table}Columns`}
                data={record}
                handleChange={() => setIsUpdating((prev) => !prev)}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default RecordEdit;
