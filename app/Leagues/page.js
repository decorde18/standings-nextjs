import Form from '@/components/Form';
import HeaderIndividualPage from '@/components/HeaderIndividualPage';
import Input from '@/components/Input';
import ListedItems from '@/components/ListedItems';

const fields = [
  {
    label: 'Name',
    name: 'name',
    type: 'text',
    placeholder: 'Enter the league/tournament name',
    required: true,
  },
  {
    label: 'Abbreviation',
    name: 'abbreviation',
    type: 'text',
    placeholder: 'Enter an abbreviation if helpful',
  },
  {
    label: 'Type',
    name: 'type',
    type: 'text',
    placeholder: 'Enter the type',
  },
  {
    label: 'Point System',
    name: 'point_system',
    type: 'number',
    placeholder: 1,
    required: true,
    disabled: true,
  },
];

function Leagues({ href }) {
  return (
    <main>
      <HeaderIndividualPage href={href} />
      <ListedItems table="leagues" />
      <Form fields={fields} buttonText="Save" />
      <Input
        label="Add A New League/Tournament"
        placeholder="Enter the league name"
        type="text"
      />
    </main>
  );
}

export default Leagues;
