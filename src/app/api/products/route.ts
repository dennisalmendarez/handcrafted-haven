import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { seller_id, name, category, price, description, image, stock } = body;

    // Validate essential fields
    if (!seller_id || !name || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO products (seller_id, name, category, price, description, image, stock)
      VALUES (${seller_id}, ${name}, ${category}, ${price}, ${description}, ${image}, ${stock})
      RETURNING *
    `;

    return NextResponse.json({ ok: true, product: result[0] });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const products = await sql`
      SELECT * FROM products ORDER BY created_at DESC
    `;

    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}