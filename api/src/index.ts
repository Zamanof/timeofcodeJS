import express, { Request, Response, RequestHandler } from 'express';
import cors from 'cors';
import { languages } from './models/Language';
import { categories } from './models/Category';
import { topics } from './models/Topic';
import { articles } from './models/Article';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Languages endpoint
const getLanguages: RequestHandler = (_req, res) => {
    res.json(languages);
};

// Categories endpoint
const getCategories: RequestHandler = (req, res) => {
    const languageId = parseInt(req.query.languageId as string);
    if (isNaN(languageId)) {
        res.status(400).json({ error: 'Invalid languageId' });
        return;
    }
    const filteredCategories = categories.filter(cat => cat.languageId === languageId);
    res.json(filteredCategories);
};

// Topics endpoint
const getTopics: RequestHandler = (req, res) => {
    const categoryId = parseInt(req.query.categoryId as string);
    if (isNaN(categoryId)) {
        res.status(400).json({ error: 'Invalid categoryId' });
        return;
    }
    const filteredTopics = topics.filter(topic => topic.categoryId === categoryId);
    res.json(filteredTopics);
};

// Articles endpoint
const getArticles: RequestHandler = (req, res) => {
    const topicId = parseInt(req.query.topicId as string);
    if (isNaN(topicId)) {
        res.status(400).json({ error: 'Invalid topicId' });
        return;
    }
    const filteredArticles = articles.filter(article => article.topicId === topicId);
    res.json(filteredArticles);
};

// Register routes
app.get('/api/languages', getLanguages);
app.get('/api/categories', getCategories);
app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);

app.listen(port, () => {
    console.log(`API server running at http://localhost:${port}`);
}); 