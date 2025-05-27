import { NextResponse } from 'next/server';
import { readDb } from '@/app/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const topicId = params.id;
  const db = await readDb();
  
  const articles = db.articles.filter(article => article.topicId === topicId);
  return NextResponse.json(articles);
} 