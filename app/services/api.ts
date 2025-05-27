const API_BASE_URL = '/api';

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
        const response = await fetch(`${API_BASE_URL}/languages`);
        if (!response.ok) throw new Error('Failed to fetch languages');
        return response.json();
    },
    getById: async (id: string): Promise<Language> => {
        const response = await fetch(`${API_BASE_URL}/languages/${id}`);
        if (!response.ok) throw new Error('Failed to fetch language');
        return response.json();
    },
    create: async (language: Omit<Language, '_id'>): Promise<Language> => {
        const response = await fetch(`${API_BASE_URL}/languages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(language),
        });
        if (!response.ok) throw new Error('Failed to create language');
        return response.json();
    },
    update: async (id: string, language: Partial<Language>): Promise<Language> => {
        const response = await fetch(`${API_BASE_URL}/languages/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(language),
        });
        if (!response.ok) throw new Error('Failed to update language');
        return response.json();
    },
    delete: async (id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/languages/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete language');
        if (response.status !== 204) throw new Error('Unexpected response status');
    }
};

const categories = {
    getByLanguage: async (languageId: string): Promise<Category[]> => {
        const response = await fetch(`${API_BASE_URL}/languages/${languageId}/categories`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        return response.json();
    },
    create: async (category: Omit<Category, '_id'>): Promise<Category> => {
        const response = await fetch(`${API_BASE_URL}/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(category),
        });
        if (!response.ok) throw new Error('Failed to create category');
        return response.json();
    },
    update: async (id: string, category: Partial<Category>): Promise<Category> => {
        const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(category),
        });
        if (!response.ok) throw new Error('Failed to update category');
        return response.json();
    },
    delete: async (id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete category');
        if (response.status !== 204) throw new Error('Unexpected response status');
    }
};

const topics = {
    getByCategory: async (categoryId: string): Promise<Topic[]> => {
        const response = await fetch(`${API_BASE_URL}/categories/${categoryId}/topics`);
        if (!response.ok) throw new Error('Failed to fetch topics');
        return response.json();
    },
    create: async (topic: Omit<Topic, '_id'>): Promise<Topic> => {
        const response = await fetch(`${API_BASE_URL}/topics`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(topic),
        });
        if (!response.ok) throw new Error('Failed to create topic');
        return response.json();
    },
    update: async (id: string, topic: Partial<Topic>): Promise<Topic> => {
        const response = await fetch(`${API_BASE_URL}/topics/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(topic),
        });
        if (!response.ok) throw new Error('Failed to update topic');
        return response.json();
    },
    delete: async (id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/topics/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete topic');
        if (response.status !== 204) throw new Error('Unexpected response status');
    }
};

const articles = {
    getByTopic: async (topicId: string): Promise<Article[]> => {
        const response = await fetch(`${API_BASE_URL}/topics/${topicId}/articles`);
        if (!response.ok) throw new Error('Failed to fetch articles');
        return response.json();
    },
    create: async (article: Omit<Article, '_id'>): Promise<Article> => {
        const response = await fetch(`${API_BASE_URL}/articles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(article),
        });
        if (!response.ok) throw new Error('Failed to create article');
        return response.json();
    },
    update: async (id: string, article: Partial<Article>): Promise<Article> => {
        const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(article),
        });
        if (!response.ok) throw new Error('Failed to update article');
        return response.json();
    },
    delete: async (id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
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