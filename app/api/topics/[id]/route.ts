import { NextResponse } from 'next/server';
import type { Topic } from '@/app/services/api';
import { readDb, writeDb } from '@/app/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const db = await readDb();
  const topic = db.topics.find(topic => topic._id === id);

  if (!topic) {
    return new NextResponse('Topic not found', { status: 404 });
  }

  return NextResponse.json(topic);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const updates = await request.json();

  const db = await readDb();
  const index = db.topics.findIndex(topic => topic._id === id);
  
  if (index === -1) {
    return new NextResponse('Topic not found', { status: 404 });
  }

  db.topics[index] = {
    ...db.topics[index],
    ...updates,
    _id: id // Ensure ID doesn't change
  };

  await writeDb(db);
  return NextResponse.json(db.topics[index]);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const db = await readDb();
  const topicIndex = db.topics.findIndex(topic => topic._id === id);

  if (topicIndex === -1) {
    return new NextResponse('Topic not found', { status: 404 });
  }

  // Delete all related articles
  db.articles = db.articles.filter(article => article.topicId !== id);

  // Delete the topic
  db.topics.splice(topicIndex, 1);

  await writeDb(db);
  return new NextResponse(null, { status: 204 });
} 