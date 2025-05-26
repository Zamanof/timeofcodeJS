const API_BASE_URL = 'http://localhost:5000/api';

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export interface Language {
    id: number;
    name: string;
    description: string;
    icon?: string;
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

export interface CodeExample {
    code: string;
    language: string;
    description: string;
}

export interface Article {
    id: number;
    title: string;
    content: string;
    topicId: number;
    order: number;
    codeExamples: CodeExample[];
}

export const api = {
    languages: {
        getAll: async (): Promise<Language[]> => {
            const response = await fetch(`${API_BASE_URL}/languages`);
            return handleResponse(response);
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
        getByLanguage: async (languageId: number): Promise<Category[]> => {
            const response = await fetch(`${API_BASE_URL}/categories?languageId=${languageId}`);
            return handleResponse(response);
        }
    },
    topics: {
        getByCategory: async (categoryId: number): Promise<Topic[]> => {
            const response = await fetch(`${API_BASE_URL}/topics?categoryId=${categoryId}`);
            return handleResponse(response);
        }
    },
    articles: {
        getByTopic: async (topicId: number): Promise<Article[]> => {
            const response = await fetch(`${API_BASE_URL}/articles?topicId=${topicId}`);
            return handleResponse(response);
        }
    }
}; 