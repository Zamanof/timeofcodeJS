import { ObjectId } from 'mongodb';

export interface Language {
    _id?: ObjectId;
    name: string;
    description: string;
    icon: string | null;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    popularity: number;
    category: string;
}

export interface Category {
    _id?: ObjectId;
    name: string;
    description: string;
    languageId: ObjectId;
    order: number;
}

export interface Topic {
    _id?: ObjectId;
    title: string;
    description: string;
    categoryId: ObjectId;
    order: number;
}

export interface CodeExample {
    _id?: ObjectId;
    code: string;
    language: string;
    description: string;
    articleId: ObjectId;
    order: number;
}

export interface Article {
    _id?: ObjectId;
    title: string;
    content: string;
    topicId: ObjectId;
    order: number;
} 