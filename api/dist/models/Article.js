"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.articles = void 0;
exports.articles = [
    // Python Variables and Data Types articles
    {
        id: 1,
        title: 'Introduction to Python Variables',
        content: `Variables in Python are created when you assign a value to them. Python is dynamically typed, meaning you don't need to declare the type of a variable.`,
        topicId: 1,
        order: 1,
        codeExamples: [
            {
                code: `name = "John"
age = 25
height = 1.75
is_student = True

print(type(name))      # <class 'str'>
print(type(age))       # <class 'int'>
print(type(height))    # <class 'float'>
print(type(is_student)) # <class 'bool'>`,
                language: 'python',
                description: 'Basic variable declarations in Python showing different data types'
            }
        ]
    },
    // Python Control Flow articles
    {
        id: 2,
        title: 'If Statements in Python',
        content: `Python uses if statements for conditional execution. The syntax is clean and relies on proper indentation.`,
        topicId: 2,
        order: 1,
        codeExamples: [
            {
                code: `age = 18

if age >= 18:
    print("You are an adult")
else:
    print("You are a minor")

# Using elif
score = 85
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
else:
    grade = "C"`,
                language: 'python',
                description: 'Examples of if-else statements and elif in Python'
            }
        ]
    },
    // JavaScript Variables articles
    {
        id: 3,
        title: 'JavaScript Variable Declaration',
        content: `JavaScript provides three ways to declare variables: var, let, and const. Each has its own scope and usage patterns.`,
        topicId: 5,
        order: 1,
        codeExamples: [
            {
                code: `// Using let for variables that can be reassigned
let age = 25;
age = 26;

// Using const for variables that cannot be reassigned
const PI = 3.14159;

// Block scope demonstration
{
    let blockScoped = "only available inside this block";
    const alsoBlockScoped = "same here";
}

// This would cause an error
// console.log(blockScoped);`,
                language: 'javascript',
                description: 'Different ways to declare variables in JavaScript'
            }
        ]
    }
];
//# sourceMappingURL=Article.js.map