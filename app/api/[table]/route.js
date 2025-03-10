import { deleteData, getData, postData, updateData } from '@/lib/data-services';
import { NextResponse } from 'next/server';

export async function GET(request, { params = {} }) {
  const { table } = await params;
  const { searchParams } = new URL(request.url);
  const filters = {};

  // Extract filters from query parameters
  for (const [key, value] of searchParams.entries()) {
    filters[key] = value;
  }

  try {
    const data = await getData(table, filters);

    if (data.error) {
      return NextResponse.json({ error: data.error }, { status: 500 });
    }

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

export async function POST(request, { params }) {
  const { table } = await params;
  const body = await request.json();
  return NextResponse.json(await postData(table, body));
}
export async function PATCH(request, { params }) {
  const { table } = await params;
  const body = await request.json();
  const { id, ...data } = body;
  return NextResponse.json(await updateData(table, id, data));
}

export async function DELETE(request, { params }) {
  const { table } = await params;
  const searchParams = Object.fromEntries(new URL(request.url).searchParams);
  return NextResponse.json(await deleteData(table, searchParams.id));
}
