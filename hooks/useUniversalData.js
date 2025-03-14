import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export async function fetchData(table, filter = {}, sort, search) {
  let url = `/api/${table}`;

  if (filter.id) {
    // Fetch single record with dynamic URL
    url = `/api/${table}/${filter.id}`;
  } else {
    // Construct query parameters for filtering, sorting, and searching
    const queryParams = new URLSearchParams();
    Object.entries(filter).forEach(([key, value]) =>
      queryParams.append(key, value)
    );
    if (sort) queryParams.append('sort', sort);
    if (search) queryParams.append('search', search);

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
  }

  console.log('Fetching URL:', url);

  const response = await fetch(url);
  console.log('Response status:', response.status);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${table}, Status: ${response.status}`);
  }

  return response.json();
}

const createData = async ({ table, data }) => {
  const response = await fetch(`/api/${table}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create record in ${table}`);
  }

  return response.json();
};

const updateData = async ({ table, id, data }) => {
  const response = await fetch(`/api/${table}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...data }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update record in ${table}`);
  }

  return response.json();
};

const deleteData = async ({ table, id }) => {
  const response = await fetch(`/api/${table}?id=${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete record in ${table}`);
  }

  return response.json();
};

// Main hook to manage all operations
export function useUniversalData({
  table,
  filter = {},
  sort,
  search,
  options = {},
}) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: [table, filter, sort, search],
    queryFn: () => fetchData(table, filter, sort, search),
    ...options,
  });

  // Mutations for CRUD operations
  const createMutation = useMutation({
    mutationFn: createData,
    onSuccess: () => queryClient.invalidateQueries([table]),
  });

  const updateMutation = useMutation({
    mutationFn: updateData,
    onSuccess: () => queryClient.invalidateQueries([table]),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteData,
    onSuccess: () => queryClient.invalidateQueries([table]),
  });

  return {
    data,
    isLoading,
    error,
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    delete: deleteMutation.mutateAsync,
  };
}
