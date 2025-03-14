import HeaderIndividualPage from '@/components/HeaderIndividualPage';

import { Suspense } from 'react';

import AddItemButton from '@/components/ui/AddItemButton';
import { DivisionsData } from './DivisionsData';
import Spinner from '@/components/ui/Spinner';

function Divisions() {
  return (
    <>
      <HeaderIndividualPage title="" description="" />
      <Suspense fallback={<Spinner />}>
        <DivisionsData />
      </Suspense>
      <AddItemButton table="divisions" label="Add Division" />
    </>
  );
}

export default Divisions;
