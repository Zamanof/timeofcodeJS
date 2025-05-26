import express from 'express';
import { dbService } from '../models/db';

const router = express.Router();

// Initialize database connection
dbService.initialize().catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
});

// Get all programming languages
router.get('/languages', async (req, res) => {
    try {
        const languages = await dbService.getLanguages();
        res.json(languages);
    } catch (error) {
        console.error('Error fetching languages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get categories for a language
router.get('/languages/:languageId/categories', async (req, res) => {
    try {
        const categories = await dbService.getCategoriesByLanguage(req.params.languageId);
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get topics for a category
router.get('/categories/:categoryId/topics', async (req, res) => {
    try {
        const topics = await dbService.getTopicsByCategory(req.params.categoryId);
        res.json(topics);
    } catch (error) {
        console.error('Error fetching topics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get articles for a topic
router.get('/topics/:topicId/articles', async (req, res) => {
    try {
        const articles = await dbService.getArticlesByTopic(req.params.topicId);
        res.json(articles);
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a specific article
router.get('/articles/:articleId', async (req, res) => {
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

export default router; 