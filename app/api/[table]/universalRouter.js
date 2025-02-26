export async function getData(table) {
  try {
    const response = await fetch(`/api/${table}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

async function getLeaguesData() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/leagues`,
    {
      cache: 'no-store', // Ensures fresh data on each request
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch leagues data');
  }

  return response.json();
}

export default async function LeaguesData() {
  const leagues = await getLeaguesData();

  return (
    <ul>
      {leagues.map((league) => (
        <li key={league.id}>{league.name}</li>
      ))}
    </ul>
  );
}
