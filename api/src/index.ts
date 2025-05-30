import express from 'express';
import cors from 'cors';
import dbService from './models/db';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

// Initialize database
dbService.initialize().catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
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

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log('Available endpoints:');
    console.log('- GET /api/languages');
    console.log('- GET /api/languages/:languageId/categories');
    console.log('- GET /api/categories/:categoryId/topics');
    console.log('- GET /api/topics/:topicId/articles');
    console.log('- GET /api/articles/:articleId');
}); 