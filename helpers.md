- GET DATA
  const {isLoading,error, data = }useUniversalData({ table, filter : {}, sort, search })

- POST DATA
  const { create } = useUniversalData({ table: 'leagues' });
  const handleCreate = async () => {
  try {
  await create({ table: 'leagues', data: { name: 'New League' } });
  console.log('League created successfully!');
  } catch (err) {
  console.error('Create Error:', err);
  }
  };

- UPDATE DATA
  const { update } = useUniversalData({ table: 'leagues' });
  const handleUpdate = async () => {
  try {
  await update({ table: 'leagues', id: 1, data: { name: 'Updated League Name' } });
  console.log('League updated successfully!');
  } catch (err) {
  console.error('Update Error:', err);
  }
  };

- DELETE DATA
  const { delete: deleteRecord } = useUniversalData({ table: 'leagues' });
  const handleDelete = async () => {
  try {
  await deleteRecord({ table: 'leagues', id: 1 });
  console.log('League deleted successfully!');
  } catch (err) {
  console.error('Delete Error:', err);
  }
  };

-- BUTTON
const Button = ({ id, name, children, type, ...props })

--FORM
const Form = ({ fields, table, initialData, redirectPath })

--TABLE
const Table = ({ columns, data, rowsPerPage = 20 })
