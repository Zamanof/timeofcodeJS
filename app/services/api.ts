const API_BASE_URL = 'http://localhost:5000/api';

const defaultFetchOptions = {
    credentials: 'include' as const,
    headers: {
        'Content-Type': 'application/json'
    }
};

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export interface Language {
    _id?: string;
    name: string;
    description: string;
    icon: string;
    difficulty: number;
    popularity: number;
    category: string[];
}

export interface Category {
    _id?: string;
    name: string;
    description: string;
    languageId: string;
    order: number;
}

export interface Topic {
    _id?: string;
    title: string;
    description: string;
    categoryId: string;
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
    order: number;
}

const languages = {
    getAll: async (): Promise<Language[]> => {
        const response = await fetch(`${API_BASE_URL}/languages`, defaultFetchOptions);
        return handleResponse(response);
    },
    getById: async (id: string): Promise<Language> => {
        const response = await fetch(`${API_BASE_URL}/languages/${id}`, defaultFetchOptions);
        return handleResponse(response);
    },
    create: async (language: Omit<Language, '_id'>): Promise<Language> => {
        const response = await fetch(`${API_BASE_URL}/languages`, {
            ...defaultFetchOptions,
            method: 'POST',
            body: JSON.stringify(language),
        });
        return handleResponse(response);
    },
    update: async (id: string, language: Partial<Language>): Promise<Language> => {
        const response = await fetch(`${API_BASE_URL}/languages/${id}`, {
            ...defaultFetchOptions,
            method: 'PUT',
            body: JSON.stringify(language),
        });
        return handleResponse(response);
    },
    delete: async (id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/languages/${id}`, {
            ...defaultFetchOptions,
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete language');
        if (response.status !== 204) throw new Error('Unexpected response status');
    }
};

const categories = {
    getByLanguage: async (languageId: string): Promise<Category[]> => {
        const response = await fetch(`${API_BASE_URL}/languages/${languageId}/categories`, defaultFetchOptions);
        return handleResponse(response);
    },
    create: async (category: Omit<Category, '_id'>): Promise<Category> => {
        const response = await fetch(`${API_BASE_URL}/categories`, {
            ...defaultFetchOptions,
            method: 'POST',
            body: JSON.stringify(category),
        });
        return handleResponse(response);
    },
    update: async (id: string, category: Partial<Category>): Promise<Category> => {
        const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
            ...defaultFetchOptions,
            method: 'PUT',
            body: JSON.stringify(category),
        });
        return handleResponse(response);
    },
    delete: async (id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
            ...defaultFetchOptions,
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete category');
        if (response.status !== 204) throw new Error('Unexpected response status');
    }
};

const topics = {
    getByCategory: async (categoryId: string): Promise<Topic[]> => {
        const response = await fetch(`${API_BASE_URL}/categories/${categoryId}/topics`, defaultFetchOptions);
        return handleResponse(response);
    },
    create: async (topic: Omit<Topic, '_id'>): Promise<Topic> => {
        const response = await fetch(`${API_BASE_URL}/topics`, {
            ...defaultFetchOptions,
            method: 'POST',
            body: JSON.stringify(topic),
        });
        return handleResponse(response);
    },
    update: async (id: string, topic: Partial<Topic>): Promise<Topic> => {
        const response = await fetch(`${API_BASE_URL}/topics/${id}`, {
            ...defaultFetchOptions,
            method: 'PUT',
            body: JSON.stringify(topic),
        });
        return handleResponse(response);
    },
    delete: async (id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/topics/${id}`, {
            ...defaultFetchOptions,
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete topic');
        if (response.status !== 204) throw new Error('Unexpected response status');
    }
};

const articles = {
    getByTopic: async (topicId: string): Promise<Article[]> => {
        const response = await fetch(`${API_BASE_URL}/topics/${topicId}/articles`, defaultFetchOptions);
        return handleResponse(response);
    },
    create: async (article: Omit<Article, '_id'>): Promise<Article> => {
        const response = await fetch(`${API_BASE_URL}/articles`, {
            ...defaultFetchOptions,
            method: 'POST',
            body: JSON.stringify(article),
        });
        return handleResponse(response);
    },
    update: async (id: string, article: Partial<Article>): Promise<Article> => {
        const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
            ...defaultFetchOptions,
            method: 'PUT',
            body: JSON.stringify(article),
        });
        return handleResponse(response);
    },
    delete: async (id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
            ...defaultFetchOptions,
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete article');
        if (response.status !== 204) throw new Error('Unexpected response status');
    }
};

export const api = {
    languages,
    categories,
    topics,
    articles,
}; 