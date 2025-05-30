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
        try {
            this.db = await connectToDatabase();
            this.languages = this.db.collection<Language>('languages');
            this.categories = this.db.collection<Category>('categories');
            this.topics = this.db.collection<Topic>('topics');
            this.articles = this.db.collection<Article>('articles');
            console.log('All collections initialized successfully');
        } catch (error) {
            console.error('Failed to initialize collections:', error);
            throw error;
        }
    }

    // Language methods
    async getLanguages() {
        if (!this.languages) throw new Error('Database not initialized');
        try {
            const result = await this.languages.find().toArray();
            console.log(`Retrieved ${result.length} languages`);
            return result;
        } catch (error) {
            console.error('Error in getLanguages:', error);
            throw error;
        }
    }

    // Category methods
    async getCategoriesByLanguage(languageId: string) {
        if (!this.categories) throw new Error('Database not initialized');
        try {
            const id = parseInt(languageId);
            if (isNaN(id)) {
                throw new Error('Invalid language ID');
            }
            const result = await this.categories.find({ languageId: id }).toArray();
            console.log(`Retrieved ${result.length} categories for language ${id}`);
            return result;
        } catch (error) {
            console.error('Error in getCategoriesByLanguage:', error);
            throw error;
        }
    }

    // Topic methods
    async getTopicsByCategory(categoryId: string) {
        if (!this.topics) throw new Error('Database not initialized');
        try {
            let query;
            // Try to parse as ObjectId first
            try {
                query = { categoryId: new ObjectId(categoryId) };
            } catch {
                // If not a valid ObjectId, try as numeric ID
                const id = parseInt(categoryId);
                if (isNaN(id)) {
                    throw new Error('Invalid category ID');
                }
                query = { categoryId: id };
            }
            const result = await this.topics.find(query).toArray();
            console.log(`Retrieved ${result.length} topics for category ${categoryId}`);
            return result;
        } catch (error) {
            console.error('Error in getTopicsByCategory:', error);
            throw error;
        }
    }

    // Article methods
    async getArticlesByTopic(topicId: string) {
        if (!this.articles) throw new Error('Database not initialized');
        try {
            let query;
            // Try to parse as ObjectId first
            try {
                query = { topicId: new ObjectId(topicId) };
            } catch {
                // If not a valid ObjectId, try as numeric ID
                const id = parseInt(topicId);
                if (isNaN(id)) {
                    throw new Error('Invalid topic ID');
                }
                query = { topicId: id };
            }
            const result = await this.articles.find(query).toArray();
            console.log(`Retrieved ${result.length} articles for topic ${topicId}`);
            return result;
        } catch (error) {
            console.error('Error in getArticlesByTopic:', error);
            throw error;
        }
    }

    async getArticleById(articleId: string) {
        if (!this.articles) throw new Error('Database not initialized');
        try {
            let query;
            // Try to parse as ObjectId first
            try {
                query = { _id: new ObjectId(articleId) };
            } catch {
                // If not a valid ObjectId, try as numeric ID
                const id = parseInt(articleId);
                if (isNaN(id)) {
                    throw new Error('Invalid article ID');
                }
                query = { id: id };
            }
            const result = await this.articles.findOne(query);
            console.log(`Retrieved article ${articleId}: ${result ? 'found' : 'not found'}`);
            return result;
        } catch (error) {
            console.error('Error in getArticleById:', error);
            throw error;
        }
    }
}

export const dbService = new DatabaseService();
export default dbService; 