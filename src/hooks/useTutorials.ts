import { useState, useEffect } from 'react';
import { api, Tutorial } from '../services/api';

export function useTutorials(languageId: number) {
    const [tutorials, setTutorials] = useState<Tutorial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (languageId) {
            fetchTutorials();
        }
    }, [languageId]);

    const fetchTutorials = async () => {
        try {
            setLoading(true);
            const data = await api.tutorials.getByLanguage(languageId);
            setTutorials(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch tutorials');
        } finally {
            setLoading(false);
        }
    };

    const addTutorial = async (tutorial: Omit<Tutorial, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
            const result = await api.tutorials.create(tutorial);
            await fetchTutorials(); // Refresh the list
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add tutorial');
            throw err;
        }
    };

    return {
        tutorials,
        loading,
        error,
        addTutorial,
        refreshTutorials: fetchTutorials,
    };
} 