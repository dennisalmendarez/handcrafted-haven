import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`;

    // 1. Drop child tables first (the ones with REFERENCES)
    await sql`DROP TABLE IF EXISTS comments`; 
    await sql`DROP TABLE IF EXISTS orders`;
    await sql`DROP TABLE IF EXISTS posts`;
    await sql`DROP TABLE IF EXISTS products`;

    // 2. Drop the parent table last
    await sql`DROP TABLE IF EXISTS users`;

    // Recreate users
    await sql`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('seller', 'customer')),
        bio TEXT DEFAULT '',
        avatar TEXT DEFAULT '',
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    // Recreate products
    await sql`
      CREATE TABLE products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price NUMERIC(10,2) NOT NULL,
        description TEXT NOT NULL,
        image TEXT NOT NULL,
        stock INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    // Recreate posts
    await sql`
      CREATE TABLE posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        author_id UUID REFERENCES users(id) ON DELETE CASCADE,
        image TEXT NOT NULL,
        message TEXT NOT NULL,
        comments_enabled BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    // Recreate orders
    await sql`
      CREATE TABLE orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        customer_id UUID REFERENCES users(id) ON DELETE SET NULL,
        customer_name TEXT NOT NULL,
        items JSONB NOT NULL DEFAULT '[]'::jsonb,
        total NUMERIC(10,2) NOT NULL,
        status TEXT NOT NULL DEFAULT 'Placed',
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    // Recreate comments
    await sql`
      CREATE TABLE IF NOT EXISTS comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
        author_id UUID REFERENCES users(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
   `;

    return NextResponse.json({
      ok: true,
      message: 'Old tables dropped and new tables created successfully.',
    });
  } catch (error) {
    console.error('Setup DB error:', error);

    return NextResponse.json(
      { ok: false, error: 'Failed to reset database tables.' },
      { status: 500 }
    );
  }
}