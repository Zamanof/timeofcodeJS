import { NextResponse } from 'next/server';
import type { Language } from '@/app/services/api';
import { readDb, writeDb } from '@/app/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const db = await readDb();
  const language = db.languages.find(lang => lang._id === id);

  if (!language) {
    return new NextResponse('Language not found', { status: 404 });
  }

  return NextResponse.json(language);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const updates = await request.json();

  const db = await readDb();
  const index = db.languages.findIndex(lang => lang._id === id);
  
  if (index === -1) {
    return new NextResponse('Language not found', { status: 404 });
  }

  db.languages[index] = {
    ...db.languages[index],
    ...updates,
    _id: id // Ensure ID doesn't change
  };

  await writeDb(db);
  return NextResponse.json(db.languages[index]);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const db = await readDb();
  const languageIndex = db.languages.findIndex(lang => lang._id === id);

  if (languageIndex === -1) {
    return new NextResponse('Language not found', { status: 404 });
  }

  // Get all categories for this language
  const categoryIds = db.categories
    .filter(cat => cat.languageId === id)
    .map(cat => cat._id);

  // Get all topics for these categories
  const topicIds = db.topics
    .filter(topic => categoryIds.includes(topic.categoryId))
    .map(topic => topic._id);

  // Delete all related articles
  db.articles = db.articles.filter(article => !topicIds.includes(article.topicId));

  // Delete all related topics
  db.topics = db.topics.filter(topic => !categoryIds.includes(topic.categoryId));

  // Delete all related categories
  db.categories = db.categories.filter(cat => cat.languageId !== id);

  // Delete the language
  db.languages.splice(languageIndex, 1);

  await writeDb(db);
  return new NextResponse(null, { status: 204 });
} 