import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { sql } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = String(body.name ?? '').trim();
    const email = String(body.email ?? '').trim().toLowerCase();
    const password = String(body.password ?? '');
    const role = body.role === 'seller' ? 'seller' : 'customer';

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    const existing = await sql`
      SELECT id
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'User already exists.' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const inserted = await sql`
      INSERT INTO users (name, email, password, role)
      VALUES (${name}, ${email}, ${hashedPassword}, ${role})
      RETURNING id, name, email, role
    `;

    return NextResponse.json({
      ok: true,
      user: inserted[0],
    });
  } catch (error) {
    console.error('Signup error:', error);

    return NextResponse.json(
      { error: 'Failed to create user.' },
      { status: 500 }
    );
  }
}