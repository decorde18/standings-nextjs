import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function GET(req) {
  const table = req.url.split('/').pop();

  try {
    const [rows] = await db.query(`SELECT * FROM ${table}`);
    return new Response(JSON.stringify(rows), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
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
