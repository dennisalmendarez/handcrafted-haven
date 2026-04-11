import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sql } from '@/lib/db';

type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image: string;
};

function normalizeItems(value: unknown): OrderItem[] {
  if (Array.isArray(value)) {
    return value as OrderItem[];
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as OrderItem[]) : [];
    } catch {
      return [];
    }
  }

  return [];
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const orders = await sql`
      SELECT
        id,
        customer_id,
        customer_name,
        items,
        total,
        status,
        created_at
      FROM orders
      WHERE customer_id = ${session.user.id}
      ORDER BY created_at DESC
    `;

    const normalizedOrders = orders.map((order) => ({
      ...order,
      items: normalizeItems(order.items),
    }));

    return NextResponse.json({ orders: normalizedOrders });
  } catch (error) {
    console.error('GET /api/orders error:', error);

    return NextResponse.json(
      { error: 'Failed to fetch orders.' },
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

    const body = await request.json();

    const customerName = String(body.customer_name ?? '').trim();
    const items = Array.isArray(body.items) ? (body.items as OrderItem[]) : [];
    const total = Number(body.total);

    if (!customerName) {
      return NextResponse.json(
        { error: 'Customer name is required.' },
        { status: 400 }
      );
    }

    if (items.length === 0) {
      return NextResponse.json(
        { error: 'Your cart is empty.' },
        { status: 400 }
      );
    }

    if (!Number.isFinite(total) || total <= 0) {
      return NextResponse.json(
        { error: 'Invalid order total.' },
        { status: 400 }
      );
    }

    const inserted = await sql`
      INSERT INTO orders (customer_id, customer_name, items, total, status)
      VALUES (
        ${session.user.id},
        ${customerName},
        ${JSON.stringify(items)},
        ${total},
        ${'Ordered'}
      )
      RETURNING id, customer_id, customer_name, items, total, status, created_at
    `;

    const order = {
      ...inserted[0],
      items: normalizeItems(inserted[0].items),
    };

    return NextResponse.json({
      ok: true,
      order,
      orderId: order.id,
    });
  } catch (error) {
    console.error('POST /api/orders error:', error);

    return NextResponse.json(
      { error: 'Failed to place order.' },
      { status: 500 }
    );
  }
}