import { NextResponse } from 'next/server';
import type { Article } from '@/app/services/api';
import { getCollection, addToCollection } from '@/app/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topicId = searchParams.get('topicId');
  
  const articles = await getCollection('articles');
  
  if (topicId) {
    return NextResponse.json(articles.filter(article => article.topicId === topicId));
  }
  
  return NextResponse.json(articles);
}

export async function POST(request: Request) {
  const article: Omit<Article, '_id'> = await request.json();
  const newArticle: Article = {
    _id: Math.random().toString(36).substr(2, 9),
    ...article
  };
  
  await addToCollection('articles', newArticle);
  return NextResponse.json(newArticle);
} 