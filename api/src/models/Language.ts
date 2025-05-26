export interface Language {
    id: number;
    name: string;
    description: string;
    icon?: string;
}

export const languages: Language[] = [
    {
        id: 1,
        name: 'Python',
        description: 'A high-level, interpreted programming language known for its simplicity and readability.',
        icon: 'python.svg'
    },
    {
        id: 2,
        name: 'JavaScript',
        description: 'A versatile programming language that powers the web and modern full-stack development.',
        icon: 'javascript.svg'
    },
    {
        id: 3,
        name: 'TypeScript',
        description: 'A typed superset of JavaScript that adds static types to the language.',
        icon: 'typescript.svg'
    }
]; 