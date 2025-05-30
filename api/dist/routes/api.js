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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../models/db"));
const router = express_1.default.Router();
// Initialize database connection
db_1.default.initialize().catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
});
// Get all languages
router.get('/languages', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const languages = yield db_1.default.getLanguages();
        res.json(languages);
    }
    catch (error) {
        console.error('Error fetching languages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Get categories for a language
router.get('/languages/:languageId/categories', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield db_1.default.getCategoriesByLanguage(req.params.languageId);
        res.json(categories);
    }
    catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Get topics for a category
router.get('/categories/:categoryId/topics', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topics = yield db_1.default.getTopicsByCategory(req.params.categoryId);
        res.json(topics);
    }
    catch (error) {
        console.error('Error fetching topics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Get articles for a topic
router.get('/topics/:topicId/articles', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articles = yield db_1.default.getArticlesByTopic(req.params.topicId);
        res.json(articles);
    }
    catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Get a single article by ID
router.get('/articles/:articleId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const article = yield db_1.default.getArticleById(req.params.articleId);
        if (!article) {
            res.status(404).json({ error: 'Article not found' });
            return;
        }
        res.json(article);
    }
    catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;
//# sourceMappingURL=api.js.map