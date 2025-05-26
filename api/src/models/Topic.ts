export interface Topic {
    id: number;
    title: string;
    description: string;
    categoryId: number;
    order: number;
}

export const topics: Topic[] = [
    // Python Basics topics
    {
        id: 1,
        title: 'Variables and Data Types',
        description: 'Understanding Python variables and basic data types',
        categoryId: 1,
        order: 1
    },
    {
        id: 2,
        title: 'Control Flow',
        description: 'If statements, loops, and control structures',
        categoryId: 1,
        order: 2
    },
    // Python Data Structures topics
    {
        id: 3,
        title: 'Lists',
        description: 'Working with Python lists',
        categoryId: 2,
        order: 1
    },
    {
        id: 4,
        title: 'Dictionaries',
        description: 'Understanding Python dictionaries',
        categoryId: 2,
        order: 2
    },
    // JavaScript Fundamentals topics
    {
        id: 5,
        title: 'Variables and Scoping',
        description: 'JavaScript variables, let, const, and scope',
        categoryId: 3,
        order: 1
    },
    {
        id: 6,
        title: 'Functions',
        description: 'Working with JavaScript functions',
        categoryId: 3,
        order: 2
    }
]; 