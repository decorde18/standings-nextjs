import { deleteData, getData, postData, updateData } from '@/lib/data-services';
import { NextResponse } from 'next/server';

export async function GET(request, { params = {} }) {
  const { table } = await params;
  const { searchParams } = new URL(request.url);
  const filters = {};
  let sort = null;
  let search = null;

  // Extract filters, sort, and search from query parameters
  for (const [key, value] of searchParams.entries()) {
    if (key === 'sort') {
      sort = value;
    } else if (key === 'search') {
      search = value;
    } else {
      filters[key] = value;
    }
  }

  try {
    let data = await getData(table, filters);

    if (data.error) {
      return NextResponse.json({ error: data.error }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Data not found' }, { status: 404 });
    }

    // Apply search
    if (search) {
      data = data.filter((item) => {
        // Implement your search logic here
        // Example: search by name field
        return Object.values(item).some((value) =>
          String(value).toLowerCase().includes(search.toLowerCase())
        );
      });
    }

    // Apply sort
    if (sort) {
      const sortFields = sort.split(',');
      data.sort((a, b) => {
        for (const sortField of sortFields) {
          const direction = sortField.startsWith('-') ? -1 : 1;
          const field = sortField.startsWith('-')
            ? sortField.slice(1)
            : sortField.slice(0);
          if (a[field] < b[field]) return -1 * direction;
          if (a[field] > b[field]) return 1 * direction;
        }
        return 0;
      });
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
