import { connectToDatabase } from '../config/database';
import { ObjectId } from 'mongodb';

async function initializeDatabase() {
    try {
        const db = await connectToDatabase();
        console.log('Connected to database successfully');

        // Drop existing collections if they exist
        const collections = ['languages', 'categories', 'topics', 'articles'];
        for (const collection of collections) {
            try {
                await db.collection(collection).drop();
                console.log(`Dropped collection: ${collection}`);
            } catch (error) {
                console.log(`Collection ${collection} does not exist or could not be dropped`);
            }
        }

        // Create collections
        await db.createCollection('languages');
        await db.createCollection('categories');
        await db.createCollection('topics');
        await db.createCollection('articles');

        // Sample data for languages
        const languages = [
            {
                name: 'JavaScript',
                description: 'A versatile programming language that powers the web.',
                icon: 'javascript-icon',
                difficulty: 'beginner',
                popularity: 1,
                category: 'Web Development'
            },
            {
                name: 'Python',
                description: 'A high-level programming language known for its simplicity and readability.',
                icon: 'python-icon',
                difficulty: 'beginner',
                popularity: 2,
                category: 'General Purpose'
            },
            {
                name: 'TypeScript',
                description: 'A typed superset of JavaScript that adds optional static typing.',
                icon: 'typescript-icon',
                difficulty: 'intermediate',
                popularity: 3,
                category: 'Web Development'
            }
        ];

        // Insert languages
        const languagesResult = await db.collection('languages').insertMany(languages);
        console.log('Inserted languages:', languagesResult.insertedIds);

        // Sample categories for each language
        const jsCategories = [
            {
                languageId: languagesResult.insertedIds[0], // JavaScript
                name: 'Fundamentals',
                description: 'Core JavaScript concepts and syntax',
                icon: 'basics-icon',
                order: 1
            },
            {
                languageId: languagesResult.insertedIds[0],
                name: 'DOM Manipulation',
                description: 'Working with the Document Object Model',
                icon: 'dom-icon',
                order: 2
            },
            {
                languageId: languagesResult.insertedIds[0],
                name: 'Async Programming',
                description: 'Promises, async/await, and callbacks',
                icon: 'async-icon',
                order: 3
            }
        ];

        const pythonCategories = [
            {
                languageId: languagesResult.insertedIds[1], // Python
                name: 'Basics',
                description: 'Fundamental Python concepts',
                icon: 'python-basics-icon',
                order: 1
            },
            {
                languageId: languagesResult.insertedIds[1],
                name: 'Data Structures',
                description: 'Built-in Python data structures',
                icon: 'data-structures-icon',
                order: 2
            }
        ];

        const tsCategories = [
            {
                languageId: languagesResult.insertedIds[2], // TypeScript
                name: 'Type System',
                description: 'TypeScript type system basics',
                icon: 'types-icon',
                order: 1
            },
            {
                languageId: languagesResult.insertedIds[2],
                name: 'Advanced Types',
                description: 'Advanced TypeScript type features',
                icon: 'advanced-types-icon',
                order: 2
            }
        ];

        // Insert all categories
        const categoriesResult = await db.collection('categories').insertMany([
            ...jsCategories,
            ...pythonCategories,
            ...tsCategories
        ]);
        console.log('Inserted categories:', categoriesResult.insertedIds);

        // Topics for all categories
        const allTopics = [
            // JavaScript Fundamentals Topics
            {
                categoryId: categoriesResult.insertedIds[0],
                title: 'Variables and Data Types',
                description: 'Understanding JavaScript variables and data types',
                difficulty: 'beginner',
                estimatedTime: '30 minutes',
                prerequisites: [],
                order: 1
            },
            {
                categoryId: categoriesResult.insertedIds[0],
                title: 'Functions and Scope',
                description: 'Working with functions and understanding scope',
                difficulty: 'beginner',
                estimatedTime: '45 minutes',
                prerequisites: ['Variables and Data Types'],
                order: 2
            },
            {
                categoryId: categoriesResult.insertedIds[0],
                title: 'Control Flow',
                description: 'Conditionals, loops, and control structures',
                difficulty: 'beginner',
                estimatedTime: '40 minutes',
                prerequisites: ['Variables and Data Types'],
                order: 3
            },
            // JavaScript DOM Topics
            {
                categoryId: categoriesResult.insertedIds[1],
                title: 'DOM Selection',
                description: 'Selecting and accessing DOM elements',
                difficulty: 'beginner',
                estimatedTime: '35 minutes',
                prerequisites: ['JavaScript Fundamentals'],
                order: 1
            },
            {
                categoryId: categoriesResult.insertedIds[1],
                title: 'Event Handling',
                description: 'Working with DOM events and event listeners',
                difficulty: 'beginner',
                estimatedTime: '40 minutes',
                prerequisites: ['DOM Selection'],
                order: 2
            },
            // JavaScript Async Topics
            {
                categoryId: categoriesResult.insertedIds[2],
                title: 'Promises',
                description: 'Understanding and working with Promises',
                difficulty: 'intermediate',
                estimatedTime: '50 minutes',
                prerequisites: ['JavaScript Fundamentals'],
                order: 1
            },
            {
                categoryId: categoriesResult.insertedIds[2],
                title: 'Async/Await',
                description: 'Modern asynchronous programming with async/await',
                difficulty: 'intermediate',
                estimatedTime: '45 minutes',
                prerequisites: ['Promises'],
                order: 2
            },
            // Python Basics Topics
            {
                categoryId: categoriesResult.insertedIds[3],
                title: 'Python Variables',
                description: 'Understanding Python variables and data types',
                difficulty: 'beginner',
                estimatedTime: '30 minutes',
                prerequisites: [],
                order: 1
            },
            {
                categoryId: categoriesResult.insertedIds[3],
                name: 'Control Structures',
                description: 'Python if statements, loops, and control flow',
                difficulty: 'beginner',
                estimatedTime: '40 minutes',
                prerequisites: ['Python Variables'],
                order: 2
            },
            // Python Data Structures Topics
            {
                categoryId: categoriesResult.insertedIds[4],
                name: 'Lists and Tuples',
                description: 'Working with Python lists and tuples',
                difficulty: 'beginner',
                estimatedTime: '45 minutes',
                prerequisites: ['Python Basics'],
                order: 1
            },
            {
                categoryId: categoriesResult.insertedIds[4],
                name: 'Dictionaries',
                description: 'Understanding Python dictionaries',
                difficulty: 'beginner',
                estimatedTime: '40 minutes',
                prerequisites: ['Lists and Tuples'],
                order: 2
            }
        ];

        // Insert topics
        const topicsResult = await db.collection('topics').insertMany(allTopics);
        console.log('Inserted topics:', topicsResult.insertedIds);

        // Articles for various topics
        const articles = [
            // JavaScript Variables Articles
            {
                topicId: topicsResult.insertedIds[0],
                title: 'Introduction to JavaScript Variables',
                content: `# Introduction to JavaScript Variables

JavaScript variables are containers for storing data values. In this article, we'll learn about:

- Variable declaration
- Data types
- Variable scope
- Best practices

## Variable Declaration

There are three ways to declare variables in JavaScript:

\`\`\`javascript
var x = 5;       // The old way (avoid using var)
let y = 6;       // The modern way for variables that can change
const z = 7;     // For variables that won't change
\`\`\`

## Data Types

JavaScript has several basic data types:

\`\`\`javascript
let string = "Hello";           // String
let number = 42;                // Number
let boolean = true;             // Boolean
let array = [1, 2, 3];         // Array
let object = {name: "John"};    // Object
let nullValue = null;          // Null
let undefinedValue;            // Undefined
\`\`\`

## Variable Scope

Variables have different scope depending on how they are declared:

\`\`\`javascript
// Global scope
let globalVar = "I'm global";

function example() {
    // Function scope
    let functionVar = "I'm function-scoped";
    
    if (true) {
        // Block scope
        let blockVar = "I'm block-scoped";
    }
}
\`\`\`

## Best Practices

1. Use meaningful variable names
2. Use camelCase for variable names
3. Prefer \`const\` when the value won't change
4. Use \`let\` instead of \`var\`
5. Declare variables at the top of their scope`,
                author: 'John Doe',
                readingTime: '10 minutes',
                difficulty: 'beginner',
                tags: ['variables', 'basics', 'javascript'],
                codeExamples: [
                    {
                        code: 'let name = "John";\nconst age = 25;\nvar isStudent = true;',
                        description: 'Basic variable declarations',
                        language: 'javascript'
                    }
                ],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                topicId: topicsResult.insertedIds[0],
                title: 'Understanding JavaScript Data Types',
                content: `JavaScript has several data types that can be broadly categorized into:
                
                Primitive Types:
                - String
                - Number
                - Boolean
                - Undefined
                - Null
                - Symbol
                - BigInt
                
                Reference Types:
                - Object
                - Array
                - Function`,
                author: 'Jane Smith',
                readingTime: '15 minutes',
                difficulty: 'beginner',
                tags: ['data types', 'basics', 'javascript'],
                codeExamples: [
                    {
                        code: 'const str = "Hello";\nconst num = 42;\nconst arr = [1, 2, 3];\nconst obj = { key: "value" };',
                        description: 'Examples of different data types',
                        language: 'javascript'
                    }
                ],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            // JavaScript Functions Articles
            {
                topicId: topicsResult.insertedIds[1],
                title: 'JavaScript Functions Fundamentals',
                content: `Functions are one of the fundamental building blocks in JavaScript. A function is a reusable block of code that performs a specific task.
                
                Key concepts covered:
                - Function declarations vs expressions
                - Arrow functions
                - Parameters and arguments
                - Return values
                - Function scope`,
                author: 'Alex Johnson',
                readingTime: '20 minutes',
                difficulty: 'beginner',
                tags: ['functions', 'basics', 'javascript'],
                codeExamples: [
                    {
                        code: 'function greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconst add = (a, b) => a + b;',
                        description: 'Different ways to declare functions',
                        language: 'javascript'
                    }
                ],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            // DOM Selection Article
            {
                topicId: topicsResult.insertedIds[3],
                title: 'Selecting DOM Elements',
                content: `The Document Object Model (DOM) provides several methods to select HTML elements:
                
                - getElementById()
                - querySelector()
                - querySelectorAll()
                - getElementsByClassName()
                - getElementsByTagName()
                
                Each method has its own use case and performance implications.`,
                author: 'Sarah Wilson',
                readingTime: '25 minutes',
                difficulty: 'beginner',
                tags: ['DOM', 'selectors', 'javascript'],
                codeExamples: [
                    {
                        code: 'const element = document.getElementById("myId");\nconst elements = document.querySelectorAll(".myClass");',
                        description: 'Common DOM selection methods',
                        language: 'javascript'
                    }
                ],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            // Python Variables Article
            {
                topicId: topicsResult.insertedIds[7],
                title: 'Python Variables and Data Types',
                content: `Python variables are created when you assign a value to them. Python is dynamically typed, meaning you don't need to declare the type explicitly.
                
                Common data types in Python:
                - Numbers (int, float)
                - Strings
                - Booleans
                - None
                
                Python's type system is strong but dynamic.`,
                author: 'Michael Chen',
                readingTime: '15 minutes',
                difficulty: 'beginner',
                tags: ['python', 'variables', 'data types'],
                codeExamples: [
                    {
                        code: 'name = "Python"\nage = 30\nheight = 1.75\nis_programming = True\n\nprint(type(name))  # <class "str">\nprint(type(age))   # <class "int">',
                        description: 'Python variable declarations and types',
                        language: 'python'
                    }
                ],
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        // Insert articles
        const articlesResult = await db.collection('articles').insertMany(articles);
        console.log('Inserted articles:', articlesResult.insertedIds);

        console.log('Database initialization completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Failed to initialize database:', error);
        process.exit(1);
    }
}

initializeDatabase(); 