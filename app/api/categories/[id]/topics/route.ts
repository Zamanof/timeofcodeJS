import { NextResponse } from 'next/server';
import { readDb } from '@/app/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const categoryId = params.id;
  const db = await readDb();
  
  const topics = db.topics.filter(topic => topic.categoryId === categoryId);
  return NextResponse.json(topics);
} 