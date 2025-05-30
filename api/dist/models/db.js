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
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.db = yield (0, database_1.connectToDatabase)();
                this.languages = this.db.collection('languages');
                this.categories = this.db.collection('categories');
                this.topics = this.db.collection('topics');
                this.articles = this.db.collection('articles');
                console.log('All collections initialized successfully');
            }
            catch (error) {
                console.error('Failed to initialize collections:', error);
                throw error;
            }
        });
    }
    // Language methods
    getLanguages() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.languages)
                throw new Error('Database not initialized');
            try {
                const result = yield this.languages.find().toArray();
                console.log(`Retrieved ${result.length} languages`);
                return result;
            }
            catch (error) {
                console.error('Error in getLanguages:', error);
                throw error;
            }
        });
    }
    // Category methods
    getCategoriesByLanguage(languageId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.categories)
                throw new Error('Database not initialized');
            try {
                const id = parseInt(languageId);
                if (isNaN(id)) {
                    throw new Error('Invalid language ID');
                }
                const result = yield this.categories.find({ languageId: id }).toArray();
                console.log(`Retrieved ${result.length} categories for language ${id}`);
                return result;
            }
            catch (error) {
                console.error('Error in getCategoriesByLanguage:', error);
                throw error;
            }
        });
    }
    // Topic methods
    getTopicsByCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.topics)
                throw new Error('Database not initialized');
            try {
                let query;
                // Try to parse as ObjectId first
                try {
                    query = { categoryId: new mongodb_1.ObjectId(categoryId) };
                }
                catch (_a) {
                    // If not a valid ObjectId, try as numeric ID
                    const id = parseInt(categoryId);
                    if (isNaN(id)) {
                        throw new Error('Invalid category ID');
                    }
                    query = { categoryId: id };
                }
                const result = yield this.topics.find(query).toArray();
                console.log(`Retrieved ${result.length} topics for category ${categoryId}`);
                return result;
            }
            catch (error) {
                console.error('Error in getTopicsByCategory:', error);
                throw error;
            }
        });
    }
    // Article methods
    getArticlesByTopic(topicId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.articles)
                throw new Error('Database not initialized');
            try {
                let query;
                // Try to parse as ObjectId first
                try {
                    query = { topicId: new mongodb_1.ObjectId(topicId) };
                }
                catch (_a) {
                    // If not a valid ObjectId, try as numeric ID
                    const id = parseInt(topicId);
                    if (isNaN(id)) {
                        throw new Error('Invalid topic ID');
                    }
                    query = { topicId: id };
                }
                const result = yield this.articles.find(query).toArray();
                console.log(`Retrieved ${result.length} articles for topic ${topicId}`);
                return result;
            }
            catch (error) {
                console.error('Error in getArticlesByTopic:', error);
                throw error;
            }
        });
    }
    getArticleById(articleId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.articles)
                throw new Error('Database not initialized');
            try {
                let query;
                // Try to parse as ObjectId first
                try {
                    query = { _id: new mongodb_1.ObjectId(articleId) };
                }
                catch (_a) {
                    // If not a valid ObjectId, try as numeric ID
                    const id = parseInt(articleId);
                    if (isNaN(id)) {
                        throw new Error('Invalid article ID');
                    }
                    query = { id: id };
                }
                const result = yield this.articles.findOne(query);
                console.log(`Retrieved article ${articleId}: ${result ? 'found' : 'not found'}`);
                return result;
            }
            catch (error) {
                console.error('Error in getArticleById:', error);
                throw error;
            }
        });
    }
}
exports.DatabaseService = DatabaseService;
exports.dbService = new DatabaseService();
exports.default = exports.dbService;
//# sourceMappingURL=db.js.map