import express from 'express';
import cors from 'cors';
import { compare } from 'bcrypt';
import dbService from './models/db';

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'https://timeofcode.dev'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());

// Initialize database
dbService.initialize().catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
});

// Admin login endpoint
app.post('/api/admins/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const admin = await dbService.getAdminByUsername(username);
        
        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await compare(password, admin.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({
            username: admin.username,
            role: admin.role
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API Routes
app.get('/api/languages', async (req, res) => {
    try {
        const languages = await dbService.getLanguages();
        res.json(languages);
    } catch (error) {
        console.error('Error fetching languages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/languages/:languageId/categories', async (req, res) => {
    try {
        const categories = await dbService.getCategoriesByLanguage(req.params.languageId);
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/categories/:categoryId/topics', async (req, res) => {
    try {
        const topics = await dbService.getTopicsByCategory(req.params.categoryId);
        res.json(topics);
    } catch (error) {
        console.error('Error fetching topics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/topics/:topicId/articles', async (req, res) => {
    try {
        const articles = await dbService.getArticlesByTopic(req.params.topicId);
        res.json(articles);
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/articles/:articleId', async (req, res) => {
    try {
        const article = await dbService.getArticleById(req.params.articleId);
        if (!article) {
            res.status(404).json({ error: 'Article not found' });
            return;
        }
        res.json(article);
    } catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Language endpoints
app.post('/api/languages', async (req, res) => {
    try {
        const language = req.body;
        const result = await dbService.createLanguage(language);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating language:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/languages/:id', async (req, res) => {
    try {
        const language = await dbService.updateLanguage(req.params.id, req.body);
        res.json(language);
    } catch (error) {
        console.error('Error updating language:', error);
        if (error instanceof Error && error.message === 'Language not found') {
            res.status(404).json({ error: 'Language not found' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

// Delete endpoints
app.delete('/api/languages/:id', async (req, res) => {
    try {
        const success = await dbService.deleteLanguage(req.params.id);
        if (success) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Language not found' });
        }
    } catch (error) {
        console.error('Error deleting language:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/categories/:id', async (req, res) => {
    try {
        const success = await dbService.deleteCategory(req.params.id);
        if (success) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Category not found' });
        }
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/topics/:id', async (req, res) => {
    try {
        const success = await dbService.deleteTopic(req.params.id);
        if (success) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Topic not found' });
        }
    } catch (error) {
        console.error('Error deleting topic:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/articles/:id', async (req, res) => {
    try {
        const success = await dbService.deleteArticle(req.params.id);
        if (success) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Article not found' });
        }
    } catch (error) {
        console.error('Error deleting article:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Category endpoints
app.post('/api/categories', async (req, res) => {
    try {
        const category = req.body;
        const result = await dbService.createCategory(category);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/categories/:id', async (req, res) => {
    try {
        const category = await dbService.updateCategory(req.params.id, req.body);
        res.json(category);
    } catch (error) {
        console.error('Error updating category:', error);
        if (error instanceof Error && error.message === 'Category not found') {
            res.status(404).json({ error: 'Category not found' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

// Topic endpoints
app.post('/api/topics', async (req, res) => {
    try {
        const topic = req.body;
        const result = await dbService.createTopic(topic);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating topic:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/topics/:id', async (req, res) => {
    try {
        const topic = await dbService.updateTopic(req.params.id, req.body);
        res.json(topic);
    } catch (error) {
        console.error('Error updating topic:', error);
        if (error instanceof Error && error.message === 'Topic not found') {
            res.status(404).json({ error: 'Topic not found' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

// Article endpoints
app.post('/api/articles', async (req, res) => {
    try {
        const article = req.body;
        const result = await dbService.createArticle(article);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating article:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/articles/:id', async (req, res) => {
    try {
        const article = await dbService.updateArticle(req.params.id, req.body);
        res.json(article);
    } catch (error) {
        console.error('Error updating article:', error);
        if (error instanceof Error && error.message === 'Article not found') {
            res.status(404).json({ error: 'Article not found' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log('Available endpoints:');
    console.log('- POST /api/admins/login');
    console.log('- GET /api/languages');
    console.log('- GET /api/languages/:languageId/categories');
    console.log('- GET /api/categories/:categoryId/topics');
    console.log('- GET /api/topics/:topicId/articles');
    console.log('- GET /api/articles/:articleId');
    console.log('- POST /api/languages');
    console.log('- POST /api/categories');
    console.log('- POST /api/topics');
    console.log('- POST /api/articles');
    console.log('- PUT /api/languages/:id');
    console.log('- PUT /api/categories/:id');
    console.log('- PUT /api/topics/:id');
    console.log('- PUT /api/articles/:id');
    console.log('- DELETE /api/languages/:id');
    console.log('- DELETE /api/categories/:id');
    console.log('- DELETE /api/topics/:id');
    console.log('- DELETE /api/articles/:id');
}); 