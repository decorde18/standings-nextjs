import db from '@/lib/db';
import { getData } from '../api/[table]/universalRouter';

export async function LeaguesData() {
  const [leagues] = await db.query('SELECT * FROM leagues'); // Fetch from MySQL
  // const leagues = await getData('leagues');
  return (
    <ul>
      {leagues.map((league) => (
        <li key={league.id}>{league.name}</li>
      ))}
    </ul>
  );
}
