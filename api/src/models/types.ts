export interface Language {
    id: number;
    name: string;
    description: string;
    icon: string | null;
}

export interface Category {
    id: number;
    name: string;
    description: string;
    languageId: number;
    order: number;
}

export interface Topic {
    id: number;
    title: string;
    description: string;
    categoryId: number;
    order: number;
}

export interface Article {
    id: number;
    title: string;
    content: string;
    topicId: number;
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