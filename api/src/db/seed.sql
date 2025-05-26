-- Seed Languages
INSERT INTO Languages (Name, Description, Icon) VALUES
('Python', 'A high-level, interpreted programming language known for its simplicity and readability.', 'python.svg'),
('JavaScript', 'A versatile programming language that powers the web and modern full-stack development.', 'javascript.svg'),
('TypeScript', 'A typed superset of JavaScript that adds static types to the language.', 'typescript.svg');

-- Seed Categories
INSERT INTO Categories (Name, Description, LanguageId, [Order]) VALUES
-- Python categories
('Basics', 'Fundamental concepts of Python programming', 1, 1),
('Data Structures', 'Built-in Python data structures and their usage', 1, 2),
-- JavaScript categories
('Fundamentals', 'Core JavaScript concepts and syntax', 2, 1),
('DOM Manipulation', 'Working with the Document Object Model', 2, 2),
-- TypeScript categories
('Type System', 'Understanding TypeScript types and type system', 3, 1),
('Advanced Types', 'Advanced TypeScript type features and patterns', 3, 2);

-- Seed Topics
INSERT INTO Topics (Title, Description, CategoryId, [Order]) VALUES
-- Python Basics topics
('Variables and Data Types', 'Understanding Python variables and basic data types', 1, 1),
('Control Flow', 'If statements, loops, and control structures', 1, 2),
-- Python Data Structures topics
('Lists', 'Working with Python lists', 2, 1),
('Dictionaries', 'Understanding Python dictionaries', 2, 2),
-- JavaScript Fundamentals topics
('Variables and Scoping', 'JavaScript variables, let, const, and scope', 3, 1),
('Functions', 'Working with JavaScript functions', 3, 2);

-- Seed Articles
INSERT INTO Articles (Title, Content, TopicId, [Order]) VALUES
('Introduction to Python Variables', 'Variables in Python are created when you assign a value to them. Python is dynamically typed, meaning you don''t need to declare the type of a variable.', 1, 1),
('If Statements in Python', 'Python uses if statements for conditional execution. The syntax is clean and relies on proper indentation.', 2, 1),
('JavaScript Variable Declaration', 'JavaScript provides three ways to declare variables: var, let, and const. Each has its own scope and usage patterns.', 5, 1);

-- Seed CodeExamples
INSERT INTO CodeExamples (Code, Language, Description, ArticleId, [Order]) VALUES
-- Python Variables example
('name = "John"
age = 25
height = 1.75
is_student = True

print(type(name))      # <class ''str''>
print(type(age))       # <class ''int''>
print(type(height))    # <class ''float''>
print(type(is_student)) # <class ''bool''>', 
'python', 
'Basic variable declarations in Python showing different data types',
1,
1),

-- Python If Statements example
('age = 18

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
    grade = "C"',
'python',
'Examples of if-else statements and elif in Python',
2,
1),

-- JavaScript Variables example
('// Using let for variables that can be reassigned
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
// console.log(blockScoped);',
'javascript',
'Different ways to declare variables in JavaScript',
3,
1); 