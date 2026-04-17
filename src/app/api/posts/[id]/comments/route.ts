// src/app/api/posts/[id]/comments/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sql } from '@/lib/db';

// Update: params must be treated as a Promise in newer Next.js versions
export async function POST(
  request: Request, 
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params; // Await the dynamic [id] from the URL

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { message } = await request.json();
    if (!message) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    // Insert the comment using the 'id' extracted from the URL
    const inserted = await sql`
      INSERT INTO comments (post_id, author_id, message)
      VALUES (${id}, ${session.user.id}, ${message})
      RETURNING *
    `;

    return NextResponse.json({ ok: true, comment: inserted[0] });
  } catch (error) {
    console.error('Comment error:', error);
    return NextResponse.json({ error: 'Failed to add comment.' }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const comments = await sql`
      SELECT c.*, u.name as author_name 
      FROM comments c 
      JOIN users u ON u.id = c.author_id 
      WHERE c.post_id = ${id} 
      ORDER BY c.created_at ASC
    `;
    return NextResponse.json({ comments });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}