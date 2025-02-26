import db from '@/lib/db';
import { allowedTables } from '@/lib/tables';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// export async function GET(req) {
//   // Define allowed tables
//   console.log('req', req);
//   const url = new URL(req.nextUrl);
//   const table = 'url.pathname.split(' / ').pop()'; // Extracts 'leagues' from '/api/leagues'

//   if (!allowedTables.includes(table)) {
//     return new Response(JSON.stringify({ error: 'Invalid table' }), {
//       status: 400,
//     });
//   }

//   try {
//     const [rows] = await db.query(`SELECT * FROM ??`, [table]); // Safe query
//     return new Response(JSON.stringify(rows), { status: 200 });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//     });
//   }
// }

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM leagues'); // Fetch leagues data
    return Response.json(rows); // Return JSON response
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  const table = 'leagues'; // You can modify this to be dynamic if needed

  try {
    const data = await req.json();

    if (!data || Object.keys(data).length === 0) {
      return new Response(JSON.stringify({ error: 'No data provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Extract column names and values dynamically
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data)
      .map(() => '?')
      .join(', ');
    const values = Object.values(data);

    // Construct the query dynamically
    const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;

    // Execute the query
    const [result] = await db.query(query, values);

    //todo make these work
    // revalidatePath('/leagues', 'layout');
    // redirect('/leagues');

    return new Response(JSON.stringify({ id: result.insertId }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
