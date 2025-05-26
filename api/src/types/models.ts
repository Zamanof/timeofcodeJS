import { ObjectId } from 'mongodb';

export interface Language {
    _id?: ObjectId;
    name: string;
    description: string;
    icon: string;
}

export interface Category {
    _id?: ObjectId;
    languageId: ObjectId;
    name: string;
    description: string;
    icon: string;
}

export interface Topic {
    _id?: ObjectId;
    categoryId: ObjectId;
    name: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Article {
    _id?: ObjectId;
    topicId: ObjectId;
    title: string;
    content: string;
    author: string;
    createdAt: Date;
    updatedAt: Date;
} 