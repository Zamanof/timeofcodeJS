"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const Language_1 = require("./models/Language");
const Category_1 = require("./models/Category");
const Topic_1 = require("./models/Topic");
const Article_1 = require("./models/Article");
const app = (0, express_1.default)();
const port = 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Languages endpoint
app.get('/api/languages', (req, res) => {
    res.json(Language_1.languages);
});
// Categories endpoint
app.get('/api/categories', (req, res) => {
    const languageId = parseInt(req.query.languageId);
    if (isNaN(languageId)) {
        return res.status(400).json({ error: 'Invalid languageId' });
    }
    const filteredCategories = Category_1.categories.filter(cat => cat.languageId === languageId);
    res.json(filteredCategories);
});
// Topics endpoint
app.get('/api/topics', (req, res) => {
    const categoryId = parseInt(req.query.categoryId);
    if (isNaN(categoryId)) {
        return res.status(400).json({ error: 'Invalid categoryId' });
    }
    const filteredTopics = Topic_1.topics.filter(topic => topic.categoryId === categoryId);
    res.json(filteredTopics);
});
// Articles endpoint
app.get('/api/articles', (req, res) => {
    const topicId = parseInt(req.query.topicId);
    if (isNaN(topicId)) {
        return res.status(400).json({ error: 'Invalid topicId' });
    }
    const filteredArticles = Article_1.articles.filter(article => article.topicId === topicId);
    res.json(filteredArticles);
});
app.listen(port, () => {
    console.log(`API server running at http://localhost:${port}`);
});
