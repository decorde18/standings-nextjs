import HeaderIndividualPage from '@/components/HeaderIndividualPage';

import { Suspense } from 'react';

import AddItemButton from '@/components/ui/AddItemButton';
import { DivisionsData } from './DivisionsData';

function Divisions() {
  return (
    <>
      <HeaderIndividualPage title="" description="" />
      <Suspense>
        <DivisionsData />
      </Suspense>
      <AddItemButton table="divisions" label="Add Division" />
    </>
  );
}

export default Divisions;
