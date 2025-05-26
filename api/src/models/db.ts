import { Db, Collection, ObjectId } from 'mongodb';
import { connectToDatabase } from '../config/database';
import { Language, Category, Topic, Article } from '../types/models';

export class DatabaseService {
    private db: Db | null = null;
    private languages: Collection<Language> | null = null;
    private categories: Collection<Category> | null = null;
    private topics: Collection<Topic> | null = null;
    private articles: Collection<Article> | null = null;

    async initialize() {
        this.db = await connectToDatabase();
        this.languages = this.db.collection<Language>('languages');
        this.categories = this.db.collection<Category>('categories');
        this.topics = this.db.collection<Topic>('topics');
        this.articles = this.db.collection<Article>('articles');
    }

    // Language methods
    async getLanguages() {
        if (!this.languages) throw new Error('Database not initialized');
        return this.languages.find().toArray();
    }

    // Category methods
    async getCategoriesByLanguage(languageId: string) {
        if (!this.categories) throw new Error('Database not initialized');
        return this.categories.find({ languageId: new ObjectId(languageId) }).toArray();
    }

    // Topic methods
    async getTopicsByCategory(categoryId: string) {
        if (!this.topics) throw new Error('Database not initialized');
        return this.topics.find({ categoryId: new ObjectId(categoryId) }).toArray();
    }

    // Article methods
    async getArticlesByTopic(topicId: string) {
        if (!this.articles) throw new Error('Database not initialized');
        return this.articles.find({ topicId: new ObjectId(topicId) }).toArray();
    }

    async getArticleById(articleId: string) {
        if (!this.articles) throw new Error('Database not initialized');
        return this.articles.findOne({ _id: new ObjectId(articleId) });
    }
}

export const dbService = new DatabaseService();
export default dbService; 