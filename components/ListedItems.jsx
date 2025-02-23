'use client';

import { useEffect, useState } from 'react';

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
      <h1>Data from {table}</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default ListedItems;
