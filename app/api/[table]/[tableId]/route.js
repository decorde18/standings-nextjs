import { getData } from '@/lib/data-services';
import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { table, tableId } = await params;

  try {
    const data = await getData(table, { id: tableId });

    if (!data) {
      return NextResponse.json({ error: 'Data not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
