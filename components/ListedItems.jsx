'use client';

import { useEffect, useState } from 'react';
import Table from './Table';

function ListedItems({ table }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`/api/${table}`)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h2>Data from {table}</h2>

      <Table data={data} />
    </div>
  );
}

export default ListedItems;
