const API_BASE_URL = 'http://localhost:5000/api';

export interface Language {
    id: number;
    name: string;
    description: string;
    icon: string;
    createdAt: string;
    updatedAt: string;
}

export interface Tutorial {
    id: number;
    title: string;
    content: string;
    languageId: number;
    createdAt: string;
    updatedAt: string;
}

export const api = {
    languages: {
        getAll: async (): Promise<Language[]> => {
            const response = await fetch(`${API_BASE_URL}/languages`);
            if (!response.ok) {
                throw new Error('Failed to fetch languages');
            }
            return response.json();
        },
        create: async (language: Omit<Language, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ id: number }> => {
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
        },
    },
    tutorials: {
        getByLanguage: async (languageId: number): Promise<Tutorial[]> => {
            const response = await fetch(`${API_BASE_URL}/tutorials/${languageId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch tutorials');
            }
            return response.json();
        },
        create: async (tutorial: Omit<Tutorial, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ id: number }> => {
            const response = await fetch(`${API_BASE_URL}/tutorials`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tutorial),
            });
            if (!response.ok) {
                throw new Error('Failed to create tutorial');
            }
            return response.json();
        },
    },
}; 