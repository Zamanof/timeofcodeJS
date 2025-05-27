import { NextResponse } from 'next/server';
import type { Topic } from '@/app/services/api';
import { getCollection, addToCollection } from '@/app/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('categoryId');
  
  const topics = await getCollection('topics');
  
  if (categoryId) {
    return NextResponse.json(topics.filter(topic => topic.categoryId === categoryId));
  }
  
  return NextResponse.json(topics);
}

export async function POST(request: Request) {
  const topic: Omit<Topic, '_id'> = await request.json();
  const newTopic: Topic = {
    _id: Math.random().toString(36).substr(2, 9),
    ...topic
  };
  
  await addToCollection('topics', newTopic);
  return NextResponse.json(newTopic);
} 