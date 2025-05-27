import express, { Request, Response } from 'express';
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
app.get('/api/languages', (_req: Request, res: Response) => {
    res.json(languages);
});

// Categories endpoint
app.get('/api/categories', (req: Request, res: Response) => {
    const languageId = parseInt(req.query.languageId as string);
    if (isNaN(languageId)) {
        return res.status(400).json({ error: 'Invalid languageId' });
    }
    const filteredCategories = categories.filter(cat => cat.languageId === languageId);
    res.json(filteredCategories);
});

// Topics endpoint
app.get('/api/topics', (req: Request, res: Response) => {
    const categoryId = parseInt(req.query.categoryId as string);
    if (isNaN(categoryId)) {
        return res.status(400).json({ error: 'Invalid categoryId' });
    }
    const filteredTopics = topics.filter(topic => topic.categoryId === categoryId);
    res.json(filteredTopics);
});

// Articles endpoint
app.get('/api/articles', (req: Request, res: Response) => {
    const topicId = parseInt(req.query.topicId as string);
    if (isNaN(topicId)) {
        return res.status(400).json({ error: 'Invalid topicId' });
    }
    const filteredArticles = articles.filter(article => article.topicId === topicId);
    res.json(filteredArticles);
});

app.listen(port, () => {
    console.log(`API server running at http://localhost:${port}`);
}); 