import DragDropForm from '@/components/ui/DragDropForm';

const options = [
  { id: 'opt1', name: 'Points' },
  { id: 'opt2', name: 'Head-To-Head' },
  { id: 'opt3', name: 'Goal Differential' },
  { id: 'opt4', name: 'Most Wins' },
  { id: 'opt5', name: 'Shutouts' },
];

const initialSelected = [
  { id: 'opt2', name: 'Head-To-Head' },
  { id: 'opt4', name: 'Most Wins' },
];

function page() {
  return (
    <DragDropForm
      options={options}
      initialSelected={initialSelected}
    ></DragDropForm>
  );
}

export default page;
