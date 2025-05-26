import { useState, useEffect } from 'react';

export interface Tutorial {
    id: number;
    title: string;
    content: string;
    languageId: number;
}

export function useTutorials(languageId: number) {
    const [tutorials, setTutorials] = useState<Tutorial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTutorials = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/tutorials/${languageId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch tutorials');
            }
            const data = await response.json();
            setTutorials(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch tutorials');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (languageId) {
            fetchTutorials();
        }
    }, [languageId]);

    const addTutorial = async (tutorial: Omit<Tutorial, 'id'>) => {
        try {
            const response = await fetch('http://localhost:5000/api/tutorials', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tutorial),
            });
            if (!response.ok) {
                throw new Error('Failed to add tutorial');
            }
            await fetchTutorials(); // Refresh the list
            return await response.json();
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