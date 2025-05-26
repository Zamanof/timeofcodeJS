const API_BASE_URL = 'http://localhost:4000/api';

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export interface Language {
    _id: string;
    id: number;
    name: string;
    description: string;
    icon: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    popularity: number;
    category: string;
}

export interface Category {
    _id?: string;
    name: string;
    description: string;
    languageId: number;
    order: number;
}

export interface Topic {
    _id?: string;
    name: string;
    description: string;
    categoryId: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime: string;
    prerequisites: string[];
    order: number;
}

export interface CodeExample {
    code: string;
    language: string;
    description: string;
}

export interface Article {
    _id?: string;
    title: string;
    content: string;
    topicId: string;
    readingTime: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    tags: string[];
    codeExamples: CodeExample[];
    createdAt: Date;
    updatedAt: Date;
}

export const api = {
    languages: {
        getAll: async (): Promise<Language[]> => {
            const response = await fetch(`${API_BASE_URL}/languages`);
            const data = await handleResponse(response);
            return data.map((lang: any, index: number) => ({
                ...lang,
                id: index + 1
            }));
        },
        create: async (language: Omit<Language, 'id'>): Promise<Language> => {
            const response = await fetch(`${API_BASE_URL}/languages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(language),
            });
            if (!response.ok) {
                throw new Error('Failed to create language');
            }
            return response.json();
        }
    },
    categories: {
        getByLanguage: async (languageId: string): Promise<Category[]> => {
            const response = await fetch(`${API_BASE_URL}/languages/${languageId}/categories`);
            return handleResponse(response);
        }
    },
    topics: {
        getByCategory: async (categoryId: string): Promise<Topic[]> => {
            const response = await fetch(`${API_BASE_URL}/categories/${categoryId}/topics`);
            return handleResponse(response);
        }
    },
    articles: {
        getByTopic: async (topicId: string): Promise<Article[]> => {
            const response = await fetch(`${API_BASE_URL}/topics/${topicId}/articles`);
            return handleResponse(response);
        }
    }
}; 