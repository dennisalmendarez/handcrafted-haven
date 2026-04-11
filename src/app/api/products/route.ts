import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sql } from '@/lib/db';

function isValidImageValue(value: string) {
  return (
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('/images/') ||
    value.startsWith('data:image/')
  );
}

export async function GET() {
  try {
    const products = await sql`
      SELECT
        p.id,
        p.seller_id,
        u.name AS seller_name,
        p.name,
        p.category,
        p.price,
        p.description,
        p.image,
        p.stock,
        p.created_at
      FROM products p
      LEFT JOIN users u ON u.id = p.seller_id
      ORDER BY p.created_at DESC
    `;

    return NextResponse.json({ products });
  } catch (error) {
    console.error('GET /api/products error:', error);

    return NextResponse.json(
      { error: 'Failed to fetch products.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    if (session.user.role !== 'seller') {
      return NextResponse.json(
        { error: 'Only sellers can create products.' },
        { status: 403 }
      );
    }

    const body = await request.json();

    const name = String(body.name ?? '').trim();
    const category = String(body.category ?? '').trim();
    const description = String(body.description ?? '').trim();
    const image = String(body.image ?? '').trim();
    const price = Number(body.price);
    const stock = Number(body.stock);

    if (!name || !category || !description || !image) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json(
        { error: 'Price must be greater than 0.' },
        { status: 400 }
      );
    }

    if (!Number.isInteger(stock) || stock < 0) {
      return NextResponse.json(
        { error: 'Stock must be 0 or more.' },
        { status: 400 }
      );
    }

    if (!isValidImageValue(image)) {
      return NextResponse.json(
        { error: 'Image must be a full URL or a local /images path.' },
        { status: 400 }
      );
    }

    const inserted = await sql`
      INSERT INTO products (seller_id, name, category, price, description, image, stock)
      VALUES (
        ${session.user.id},
        ${name},
        ${category},
        ${price},
        ${description},
        ${image},
        ${stock}
      )
      RETURNING *
    `;

    return NextResponse.json({
      ok: true,
      product: inserted[0],
    });
  } catch (error) {
    console.error('POST /api/products error:', error);

    return NextResponse.json(
      { error: 'Failed to create product.' },
      { status: 500 }
    );
  }
}