import { useState, useEffect } from 'react';
import { api, Language } from '@/services/api';

export function useLanguages() {
    const [languages, setLanguages] = useState<Language[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchLanguages();
    }, []);

    const fetchLanguages = async () => {
        try {
            setLoading(true);
            const data = await api.languages.getAll();
            setLanguages(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch languages');
        } finally {
            setLoading(false);
        }
    };

    const addLanguage = async (language: Omit<Language, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
            const result = await api.languages.create(language);
            await fetchLanguages(); // Refresh the list
            return result;
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