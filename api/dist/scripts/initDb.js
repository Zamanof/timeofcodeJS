"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
function initializeDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = yield (0, database_1.connectToDatabase)();
            console.log('Connected to database successfully');
            // Drop existing collections if they exist
            const collections = ['languages', 'categories', 'topics', 'articles'];
            for (const collection of collections) {
                try {
                    yield db.collection(collection).drop();
                    console.log(`Dropped collection: ${collection}`);
                }
                catch (error) {
                    console.log(`Collection ${collection} does not exist or could not be dropped`);
                }
            }
            // Create collections
            yield db.createCollection('languages');
            yield db.createCollection('categories');
            yield db.createCollection('topics');
            yield db.createCollection('articles');
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
            const languagesResult = yield db.collection('languages').insertMany(languages);
            console.log('Inserted languages:', languagesResult.insertedIds);
            // Sample categories for each language
            const jsCategories = [
                {
                    languageId: 1, // JavaScript
                    name: 'Fundamentals',
                    description: 'Core JavaScript concepts and syntax',
                    icon: 'basics-icon',
                    order: 1
                },
                {
                    languageId: 1,
                    name: 'DOM Manipulation',
                    description: 'Working with the Document Object Model',
                    icon: 'dom-icon',
                    order: 2
                },
                {
                    languageId: 1,
                    name: 'Async Programming',
                    description: 'Promises, async/await, and callbacks',
                    icon: 'async-icon',
                    order: 3
                }
            ];
            const pythonCategories = [
                {
                    languageId: 2, // Python
                    name: 'Basics',
                    description: 'Fundamental Python concepts',
                    icon: 'python-basics-icon',
                    order: 1
                },
                {
                    languageId: 2,
                    name: 'Data Structures',
                    description: 'Built-in Python data structures',
                    icon: 'data-structures-icon',
                    order: 2
                }
            ];
            const tsCategories = [
                {
                    languageId: 3, // TypeScript
                    name: 'Type System',
                    description: 'TypeScript type system basics',
                    icon: 'types-icon',
                    order: 1
                },
                {
                    languageId: 3,
                    name: 'Advanced Types',
                    description: 'Advanced TypeScript type features',
                    icon: 'advanced-types-icon',
                    order: 2
                }
            ];
            // Insert all categories
            const categoriesResult = yield db.collection('categories').insertMany([
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
                    name: 'Variables and Data Types',
                    description: 'Understanding JavaScript variables and data types',
                    difficulty: 'beginner',
                    estimatedTime: '30 minutes',
                    prerequisites: [],
                    order: 1
                },
                {
                    categoryId: categoriesResult.insertedIds[0],
                    name: 'Functions and Scope',
                    description: 'Working with functions and understanding scope',
                    difficulty: 'beginner',
                    estimatedTime: '45 minutes',
                    prerequisites: ['Variables and Data Types'],
                    order: 2
                },
                {
                    categoryId: categoriesResult.insertedIds[0],
                    name: 'Control Flow',
                    description: 'Conditionals, loops, and control structures',
                    difficulty: 'beginner',
                    estimatedTime: '40 minutes',
                    prerequisites: ['Variables and Data Types'],
                    order: 3
                },
                // JavaScript DOM Topics
                {
                    categoryId: categoriesResult.insertedIds[1],
                    name: 'DOM Selection',
                    description: 'Selecting and accessing DOM elements',
                    difficulty: 'beginner',
                    estimatedTime: '35 minutes',
                    prerequisites: ['JavaScript Fundamentals'],
                    order: 1
                },
                {
                    categoryId: categoriesResult.insertedIds[1],
                    name: 'Event Handling',
                    description: 'Working with DOM events and event listeners',
                    difficulty: 'beginner',
                    estimatedTime: '40 minutes',
                    prerequisites: ['DOM Selection'],
                    order: 2
                },
                // JavaScript Async Topics
                {
                    categoryId: categoriesResult.insertedIds[2],
                    name: 'Promises',
                    description: 'Understanding and working with Promises',
                    difficulty: 'intermediate',
                    estimatedTime: '50 minutes',
                    prerequisites: ['JavaScript Fundamentals'],
                    order: 1
                },
                {
                    categoryId: categoriesResult.insertedIds[2],
                    name: 'Async/Await',
                    description: 'Modern asynchronous programming with async/await',
                    difficulty: 'intermediate',
                    estimatedTime: '45 minutes',
                    prerequisites: ['Promises'],
                    order: 2
                },
                // Python Basics Topics
                {
                    categoryId: categoriesResult.insertedIds[3],
                    name: 'Python Variables',
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
            // Insert all topics
            const topicsResult = yield db.collection('topics').insertMany(allTopics);
            console.log('Inserted topics:', topicsResult.insertedIds);
            // Articles for various topics
            const articles = [
                // JavaScript Variables Articles
                {
                    topicId: topicsResult.insertedIds[0],
                    title: 'Introduction to JavaScript Variables',
                    content: `JavaScript variables are containers for storing data values. There are three ways to declare variables in JavaScript:
                
                1. var (function-scoped or globally-scoped)
                2. let (block-scoped)
                3. const (block-scoped, constant value)
                
                Let's explore each of these in detail...`,
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
            const articlesResult = yield db.collection('articles').insertMany(articles);
            console.log('Inserted articles:', articlesResult.insertedIds);
            console.log('Database initialization completed successfully');
            process.exit(0);
        }
        catch (error) {
            console.error('Error initializing database:', error);
            process.exit(1);
        }
    });
}
initializeDatabase();
//# sourceMappingURL=initDb.js.map