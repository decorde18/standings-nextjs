import HeaderIndividualPage from '@/components/HeaderIndividualPage';
import Input from '@/components/ui/Input';
import ListedItems from '@/components/ListedItems';
import Form from '@/components/ui/Form';
import { getData } from '../api/[table]/universalRouter';
import { Suspense } from 'react';
import { LeaguesData } from './LeaguesData';

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
    required: true,
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

// async function LeaguesData() {
//   const leagues = await getData('leagues');
//   return (
//     <ul>
//       {leagues.map((league) => (
//         <li key={league.id}>{league.name}</li>
//       ))}
//     </ul>
//   );
// }
function Leagues({ href }) {
  return (
    <>
      <HeaderIndividualPage href={href} />
      <Suspense>
        <LeaguesData />
      </Suspense>
      {/* <ListedItems table="leagues" />
      <Form fields={fields} buttonText="Save" />
      <Input
        label="Add A New League/Tournament"
        placeholder="Enter the league name"
        type="text"
      /> */}
    </>
  );
}

export default Leagues;
