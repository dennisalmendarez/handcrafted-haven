import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { customer_id, customer_name, items, total } = await request.json();

    const result = await sql`
      INSERT INTO orders (customer_id, customer_name, items, total)
      VALUES (${customer_id}, ${customer_name}, ${JSON.stringify(items)}, ${total})
      RETURNING id
    `;

    return NextResponse.json({ ok: true, orderId: result[0].id });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
  }
}