"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbService = exports.DatabaseService = void 0;
const mongodb_1 = require("mongodb");
const database_1 = require("../config/database");
class DatabaseService {
    constructor() {
        this.db = null;
        this.languages = null;
        this.categories = null;
        this.topics = null;
        this.articles = null;
    }
    async initialize() {
        this.db = await (0, database_1.connectToDatabase)();
        this.languages = this.db.collection('languages');
        this.categories = this.db.collection('categories');
        this.topics = this.db.collection('topics');
        this.articles = this.db.collection('articles');
    }
    // Language methods
    async getLanguages() {
        if (!this.languages)
            throw new Error('Database not initialized');
        return this.languages.find().toArray();
    }
    // Category methods
    async getCategoriesByLanguage(languageId) {
        if (!this.categories)
            throw new Error('Database not initialized');
        return this.categories.find({ languageId: new mongodb_1.ObjectId(languageId) }).toArray();
    }
    // Topic methods
    async getTopicsByCategory(categoryId) {
        if (!this.topics)
            throw new Error('Database not initialized');
        return this.topics.find({ categoryId: new mongodb_1.ObjectId(categoryId) }).toArray();
    }
    // Article methods
    async getArticlesByTopic(topicId) {
        if (!this.articles)
            throw new Error('Database not initialized');
        return this.articles.find({ topicId: new mongodb_1.ObjectId(topicId) }).toArray();
    }
    async getArticleById(articleId) {
        if (!this.articles)
            throw new Error('Database not initialized');
        return this.articles.findOne({ _id: new mongodb_1.ObjectId(articleId) });
    }
}
exports.DatabaseService = DatabaseService;
exports.dbService = new DatabaseService();
exports.default = exports.dbService;
