import { ObjectId } from 'mongodb';

export interface Language {
    _id?: ObjectId;
    name: string;
    description: string;
    icon: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    popularity: number;
    category: string;
}

export interface Category {
    _id?: ObjectId;
    languageId: number;
    name: string;
    description: string;
    icon: string;
    order: number;
}

export interface Topic {
    _id?: ObjectId;
    categoryId: ObjectId;
    name: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime: string;
    prerequisites: string[];
    order: number;
}

export interface CodeExample {
    code: string;
    description: string;
    language: string;
}

export interface Article {
    _id?: ObjectId;
    topicId: ObjectId;
    title: string;
    content: string;
    author: string;
    readingTime: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    tags: string[];
    codeExamples: CodeExample[];
    createdAt: Date;
    updatedAt: Date;
} 