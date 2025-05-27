import { NextResponse } from 'next/server';
import { readDb } from '@/app/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const languageId = params.id;
  const db = await readDb();
  
  const categories = db.categories.filter(cat => cat.languageId === languageId);
  return NextResponse.json(categories);
} 