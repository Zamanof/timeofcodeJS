import { NextResponse } from 'next/server';
import type { Category } from '@/app/services/api';
import { getCollection, addToCollection } from '@/app/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const languageId = searchParams.get('languageId');
  
  const categories = await getCollection('categories');
  
  if (languageId) {
    return NextResponse.json(categories.filter(cat => cat.languageId === languageId));
  }
  
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const category: Omit<Category, '_id'> = await request.json();
  const newCategory: Category = {
    _id: Math.random().toString(36).substr(2, 9),
    ...category
  };
  
  await addToCollection('categories', newCategory);
  return NextResponse.json(newCategory);
} 