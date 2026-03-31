import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    await sql`
      CREATE EXTENSION IF NOT EXISTS "pgcrypto"
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('seller', 'customer')),
        bio TEXT DEFAULT '',
        avatar TEXT DEFAULT '',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price NUMERIC(10,2) NOT NULL,
        description TEXT NOT NULL,
        image TEXT NOT NULL,
        stock INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        author_id UUID REFERENCES users(id) ON DELETE CASCADE,
        image TEXT NOT NULL,
        message TEXT NOT NULL,
        comments_enabled BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        customer_id UUID REFERENCES users(id) ON DELETE SET NULL,
        customer_name TEXT NOT NULL,
        total NUMERIC(10,2) NOT NULL,
        status TEXT NOT NULL DEFAULT 'Placed',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    return NextResponse.json({ ok: true, message: 'Database tables created.' });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: 'Failed to create database tables.' },
      { status: 500 }
    );
  }
}