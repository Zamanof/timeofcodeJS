import { useState, useEffect } from 'react';

export interface Language {
    id: number;
    name: string;
    description: string;
    icon: string;
}

export function useLanguages() {
    const [languages, setLanguages] = useState<Language[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLanguages = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/languages');
            if (!response.ok) {
                throw new Error('Failed to fetch languages');
            }
            const data = await response.json();
            setLanguages(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch languages');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLanguages();
    }, []);

    const addLanguage = async (language: Omit<Language, 'id'>) => {
        try {
            const response = await fetch('http://localhost:5000/api/languages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(language),
            });
            if (!response.ok) {
                throw new Error('Failed to add language');
            }
            await fetchLanguages(); // Refresh the list
            return await response.json();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add language');
            throw err;
        }
    };

    return {
        languages,
        loading,
        error,
        addLanguage,
        refreshLanguages: fetchLanguages,
    };
} 