- GET DATA
  const {isLoading,error, data }= useUniversalData({ table, filter : {}, sort, search })

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
--AddItemButton
function AddItemButton({ table, label, queryParams = {{ league_id: league.id }} })

--FORM
const Form = ({ fields, table, initialData, redirectPath })

--TABLE
const Table = ({ columns, data, handleInput, handleSelect, handleRow,
selected,
handleDelete,rowsPerPage = 20 })

-- INPUT
const Input = ({
id,
label,
name,
value,
placeholder,
type = 'text',
onChange,

...props
})

-- SELECT
const Select = ({
id,
label,
name,
options = [],
value,
onChange,
placeholder = 'Please select an option',
...props
})

--RANKING
rankTeams(teams, config) config =
// - tiebreakers: array of objects like { category_key
: "goalDifference", priority: 1 sortDirection:'descending'}.
// - tiebreakerStyle: "exhaustive" or "dynamic".
// - headToHeadResults: an object mapping team names to opponents and wins.
// - headToHeadStyle: "exhaustive" or "dynamic" (for future extension).
// - headToHeadSkipForMultiple: if true (1), skip head-to-head if more than 2 teams are tied.
