import { NextResponse } from 'next/server';
import { readDb } from '@/app/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const db = await readDb();
  const admin = db.admins.find(
    (a) => a.username === username && a.password === password
  );

  if (!admin) {
    return new NextResponse(
      JSON.stringify({ error: 'Invalid credentials' }),
      { status: 401 }
    );
  }

  // In a real application, you should use a proper session management system
  // and never store plain text passwords
  const cookieStore = cookies();
  cookieStore.set('admin_session', JSON.stringify({
    username: admin.username,
    role: admin.role
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  });

  return NextResponse.json({ 
    username: admin.username,
    role: admin.role
  });
} 