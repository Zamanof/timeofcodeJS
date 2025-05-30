import { ObjectId } from 'mongodb';

export interface Language {
    _id?: ObjectId;
    id: number;
    name: string;
    description: string;
    icon: string | null;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    popularity: number;
    category: string;
}

export interface Category {
    _id?: ObjectId;
    id: number;
    name: string;
    description: string;
    languageId: number;
    order: number;
}

export interface Topic {
    _id?: ObjectId;
    id: number;
    title: string;
    description: string;
    categoryId: ObjectId;
    order: number;
}

export interface CodeExample {
    id: number;
    code: string;
    language: string;
    description: string;
    articleId: number;
    order: number;
}

export interface Article {
    _id?: ObjectId;
    id: number;
    title: string;
    content: string;
    topicId: ObjectId;
    order: number;
} 