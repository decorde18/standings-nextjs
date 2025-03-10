import HeaderIndividualPage from '@/components/HeaderIndividualPage';
import Table from '@/components/Table';
import Form from '@/components/ui/Form';
import { teamsColumns } from '@/lib/tables';
import { TeamsData } from './TeamsData';

function Games({ href }) {
  return (
    <div>
      <HeaderIndividualPage href={href} />
      <Form fields={teamsColumns} buttonText="Save" />
      <TeamsData href={href} />
    </div>
  );
}

export default Games;
