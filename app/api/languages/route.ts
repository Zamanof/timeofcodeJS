import { NextResponse } from 'next/server';
import type { Language } from '@/app/services/api';
import { getCollection, addToCollection } from '@/app/lib/db';

export async function GET() {
  const languages = await getCollection('languages');
  return NextResponse.json(languages);
}

export async function POST(request: Request) {
  const language: Omit<Language, '_id'> = await request.json();
  const newLanguage: Language = {
    _id: Math.random().toString(36).substr(2, 9),
    ...language,
    difficulty: language.difficulty || 1,
    popularity: language.popularity || 1,
    category: language.category || []
  };
  
  await addToCollection('languages', newLanguage);
  return NextResponse.json(newLanguage);
} 