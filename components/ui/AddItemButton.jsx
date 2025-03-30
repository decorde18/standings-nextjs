'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Button from './Button';
import { useState } from 'react';
import Spinner from './Spinner';

function AddItemButton({ table, label }) {
  // Add queryParams prop
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    setIsLoading(true);

    let url = `/create/${table}`;
    const queryString = new URLSearchParams(searchParams).toString(); // Convert queryParams to string

    if (queryString) {
      url += `?${queryString}`; // Append query parameters to URL
    }

    await router.push(url);
    setIsLoading(false);
  }

  return (
    <div className="flex-centered-columns">
      <div className="center-column">
        {isLoading ? (
          <Spinner />
        ) : (
          <Button name="add" type="button" onClick={handleClick}>
            {label}
          </Button>
        )}
      </div>
    </div>
  );
}

export default AddItemButton;
