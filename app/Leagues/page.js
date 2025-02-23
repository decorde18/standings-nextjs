import HeaderIndividualPage from '@/components/HeaderIndividualPage';
import ListedItems from '@/components/ListedItems';

function Leagues({ href }) {
  return (
    <main>
      <HeaderIndividualPage href={href} />
      <ListedItems table="leagues" />
    </main>
  );
}

export default Leagues;
