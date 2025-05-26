const express = require('express');
const cors = require('cors');

const app = express();

// In-memory data
const languages = [
    { id: 1, name: 'Python', description: 'A versatile programming language known for its simplicity', icon: 'python-icon.png' },
    { id: 2, name: 'JavaScript', description: 'A dynamic programming language for web development', icon: 'javascript-icon.png' },
    { id: 3, name: 'Java', description: 'A popular object-oriented programming language', icon: 'java-icon.png' }
];

const tutorials = [
    { id: 1, title: 'Python Basics', content: 'Learn Python fundamentals', languageId: 1 },
    { id: 2, title: 'Python Functions', content: 'Understanding Python functions', languageId: 1 },
    { id: 3, title: 'JavaScript Basics', content: 'Getting started with JavaScript', languageId: 2 },
    { id: 4, title: 'Java OOP', content: 'Object-oriented programming in Java', languageId: 3 }
];

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Routes
app.get('/api/languages', (req, res) => {
    res.json(languages);
});

app.get('/api/tutorials/:languageId', (req, res) => {
    const languageId = parseInt(req.params.languageId);
    const languageTutorials = tutorials.filter(t => t.languageId === languageId);
    res.json(languageTutorials);
});

app.post('/api/languages', (req, res) => {
    const { name, description, icon } = req.body;
    const newLanguage = {
        id: languages.length + 1,
        name,
        description,
        icon
    };
    languages.push(newLanguage);
    res.status(201).json({ id: newLanguage.id });
});

app.post('/api/tutorials', (req, res) => {
    const { title, content, languageId } = req.body;
    const newTutorial = {
        id: tutorials.length + 1,
        title,
        content,
        languageId: parseInt(languageId)
    };
    tutorials.push(newTutorial);
    res.status(201).json({ id: newTutorial.id });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 