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
    const posts = await sql`
      SELECT
        p.id,
        p.author_id,
        u.name AS author_name,
        u.role AS author_role,
        p.image,
        p.message,
        p.comments_enabled,
        p.created_at
      FROM posts p
      LEFT JOIN users u ON u.id = p.author_id
      ORDER BY p.created_at DESC
    `;

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('GET /api/posts error:', error);

    return NextResponse.json(
      { error: 'Failed to fetch posts.' },
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
        { error: 'Only sellers can create posts.' },
        { status: 403 }
      );
    }

    const body = await request.json();

    const image = String(body.image ?? '').trim();
    const message = String(body.message ?? '').trim();
    const commentsEnabled =
      typeof body.commentsEnabled === 'boolean' ? body.commentsEnabled : true;

    if (!image || !message) {
      return NextResponse.json(
        { error: 'Image and message are required.' },
        { status: 400 }
      );
    }

    if (!isValidImageValue(image)) {
      return NextResponse.json(
        {
          error:
            'Image must be a full URL, a local /images path, or a data:image string.',
        },
        { status: 400 }
      );
    }

    const inserted = await sql`
      INSERT INTO posts (author_id, image, message, comments_enabled)
      VALUES (${session.user.id}, ${image}, ${message}, ${commentsEnabled})
      RETURNING *
    `;

    return NextResponse.json({
      ok: true,
      post: inserted[0],
    });
  } catch (error) {
    console.error('POST /api/posts error:', error);

    return NextResponse.json(
      { error: 'Failed to create post.' },
      { status: 500 }
    );
  }
}