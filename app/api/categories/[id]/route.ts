import { NextResponse } from 'next/server';
import type { Category } from '@/app/services/api';
import { readDb, writeDb } from '@/app/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const db = await readDb();
  const category = db.categories.find(cat => cat._id === id);

  if (!category) {
    return new NextResponse('Category not found', { status: 404 });
  }

  return NextResponse.json(category);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const updates = await request.json();

  const db = await readDb();
  const index = db.categories.findIndex(cat => cat._id === id);
  
  if (index === -1) {
    return new NextResponse('Category not found', { status: 404 });
  }

  db.categories[index] = {
    ...db.categories[index],
    ...updates,
    _id: id // Ensure ID doesn't change
  };

  await writeDb(db);
  return NextResponse.json(db.categories[index]);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const db = await readDb();
  const categoryIndex = db.categories.findIndex(cat => cat._id === id);

  if (categoryIndex === -1) {
    return new NextResponse('Category not found', { status: 404 });
  }

  // Get all topics for this category
  const topicIds = db.topics
    .filter(topic => topic.categoryId === id)
    .map(topic => topic._id);

  // Delete all related articles
  db.articles = db.articles.filter(article => !topicIds.includes(article.topicId));

  // Delete all related topics
  db.topics = db.topics.filter(topic => topic.categoryId !== id);

  // Delete the category
  db.categories.splice(categoryIndex, 1);

  await writeDb(db);
  return new NextResponse(null, { status: 204 });
} 