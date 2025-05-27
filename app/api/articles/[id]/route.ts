import { NextResponse } from 'next/server';
import type { Article } from '@/app/services/api';
import { readDb, writeDb } from '@/app/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const db = await readDb();
  const article = db.articles.find(article => article._id === id);

  if (!article) {
    return new NextResponse('Article not found', { status: 404 });
  }

  return NextResponse.json(article);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const updates = await request.json();

  const db = await readDb();
  const index = db.articles.findIndex(article => article._id === id);
  
  if (index === -1) {
    return new NextResponse('Article not found', { status: 404 });
  }

  db.articles[index] = {
    ...db.articles[index],
    ...updates,
    _id: id // Ensure ID doesn't change
  };

  await writeDb(db);
  return NextResponse.json(db.articles[index]);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const db = await readDb();
  const articleIndex = db.articles.findIndex(article => article._id === id);

  if (articleIndex === -1) {
    return new NextResponse('Article not found', { status: 404 });
  }

  // Delete the article
  db.articles.splice(articleIndex, 1);

  await writeDb(db);
  return new NextResponse(null, { status: 204 });
} 