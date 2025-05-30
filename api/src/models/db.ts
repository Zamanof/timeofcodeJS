import { Db, Collection, ObjectId } from 'mongodb';
import { connectToDatabase } from '../config/database';
import { Language, Category, Topic, Article } from '../types/models';

interface Admin {
    _id?: ObjectId;
    username: string;
    password: string;
    role: 'admin' | 'super_admin';
    createdAt: Date;
    updatedAt: Date;
}

export class DatabaseService {
    private db: Db | null = null;
    private languages: Collection<Language> | null = null;
    private categories: Collection<Category> | null = null;
    private topics: Collection<Topic> | null = null;
    private articles: Collection<Article> | null = null;
    private admins: Collection<Admin> | null = null;

    async initialize() {
        try {
            this.db = await connectToDatabase();
            this.languages = this.db.collection<Language>('languages');
            this.categories = this.db.collection<Category>('categories');
            this.topics = this.db.collection<Topic>('topics');
            this.articles = this.db.collection<Article>('articles');
            this.admins = this.db.collection<Admin>('admins');
            console.log('All collections initialized successfully');
        } catch (error) {
            console.error('Failed to initialize collections:', error);
            throw error;
        }
    }

    async getAdminByUsername(username: string) {
        if (!this.admins) throw new Error('Database not initialized');
        return this.admins.findOne({ username });
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

    async createLanguage(language: Omit<Language, '_id'>) {
        if (!this.languages) throw new Error('Database not initialized');
        try {
            const result = await this.languages.insertOne(language);
            console.log(`Created language with ID: ${result.insertedId}`);
            return { ...language, _id: result.insertedId };
        } catch (error) {
            console.error('Error in createLanguage:', error);
            throw error;
        }
    }

    async updateLanguage(id: string, updates: Partial<Language>) {
        if (!this.languages) throw new Error('Database not initialized');
        try {
            const objectId = new ObjectId(id);
            // Remove _id from updates if it exists
            const { _id, ...updatesWithoutId } = updates;
            const result = await this.languages.updateOne(
                { _id: objectId },
                { $set: updatesWithoutId }
            );
            if (result.matchedCount === 0) {
                throw new Error('Language not found');
            }
            return this.languages.findOne({ _id: objectId });
        } catch (error) {
            console.error('Error in updateLanguage:', error);
            throw error;
        }
    }

    // Category methods
    async getCategoriesByLanguage(languageId: string) {
        if (!this.categories) throw new Error('Database not initialized');
        try {
            const objectId = new ObjectId(languageId);
            const result = await this.categories.find({ languageId: objectId }).toArray();
            console.log(`Retrieved ${result.length} categories for language ${languageId}`);
            return result;
        } catch (error) {
            console.error('Error in getCategoriesByLanguage:', error);
            throw error;
        }
    }

    async createCategory(category: Omit<Category, '_id'>) {
        if (!this.categories) throw new Error('Database not initialized');
        try {
            // Convert languageId to ObjectId
            const categoryWithObjectId = {
                ...category,
                languageId: new ObjectId(category.languageId)
            };
            const result = await this.categories.insertOne(categoryWithObjectId);
            console.log(`Created category with ID: ${result.insertedId}`);
            return { ...categoryWithObjectId, _id: result.insertedId };
        } catch (error) {
            console.error('Error in createCategory:', error);
            throw error;
        }
    }

    async updateCategory(id: string, updates: Partial<Category>) {
        if (!this.categories) throw new Error('Database not initialized');
        try {
            const objectId = new ObjectId(id);
            // Remove _id from updates and convert languageId to ObjectId
            const { _id, ...updatesWithoutId } = updates;
            const updatesWithObjectId = updatesWithoutId.languageId
                ? { ...updatesWithoutId, languageId: new ObjectId(updatesWithoutId.languageId) }
                : updatesWithoutId;
            const result = await this.categories.updateOne(
                { _id: objectId },
                { $set: updatesWithObjectId }
            );
            if (result.matchedCount === 0) {
                throw new Error('Category not found');
            }
            return this.categories.findOne({ _id: objectId });
        } catch (error) {
            console.error('Error in updateCategory:', error);
            throw error;
        }
    }

    // Topic methods
    async getTopicsByCategory(categoryId: string) {
        if (!this.topics) throw new Error('Database not initialized');
        try {
            const objectId = new ObjectId(categoryId);
            const result = await this.topics.find({ categoryId: objectId }).toArray();
            console.log(`Retrieved ${result.length} topics for category ${categoryId}`);
            return result;
        } catch (error) {
            console.error('Error in getTopicsByCategory:', error);
            throw error;
        }
    }

    async createTopic(topic: Omit<Topic, '_id'>) {
        if (!this.topics) throw new Error('Database not initialized');
        try {
            // Convert categoryId to ObjectId
            const topicWithObjectId = {
                ...topic,
                categoryId: new ObjectId(topic.categoryId)
            };
            const result = await this.topics.insertOne(topicWithObjectId);
            console.log(`Created topic with ID: ${result.insertedId}`);
            return { ...topicWithObjectId, _id: result.insertedId };
        } catch (error) {
            console.error('Error in createTopic:', error);
            throw error;
        }
    }

    async updateTopic(id: string, updates: Partial<Topic>) {
        if (!this.topics) throw new Error('Database not initialized');
        try {
            const objectId = new ObjectId(id);
            // Remove _id from updates and convert categoryId to ObjectId
            const { _id, ...updatesWithoutId } = updates;
            const updatesWithObjectId = updatesWithoutId.categoryId
                ? { ...updatesWithoutId, categoryId: new ObjectId(updatesWithoutId.categoryId) }
                : updatesWithoutId;
            const result = await this.topics.updateOne(
                { _id: objectId },
                { $set: updatesWithObjectId }
            );
            if (result.matchedCount === 0) {
                throw new Error('Topic not found');
            }
            return this.topics.findOne({ _id: objectId });
        } catch (error) {
            console.error('Error in updateTopic:', error);
            throw error;
        }
    }

    // Article methods
    async getArticlesByTopic(topicId: string) {
        if (!this.articles) throw new Error('Database not initialized');
        try {
            const objectId = new ObjectId(topicId);
            const result = await this.articles.find({ topicId: objectId }).toArray();
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

    async createArticle(article: Omit<Article, '_id'>) {
        if (!this.articles) throw new Error('Database not initialized');
        try {
            // Convert topicId to ObjectId
            const articleWithObjectId = {
                ...article,
                topicId: new ObjectId(article.topicId)
            };
            const result = await this.articles.insertOne(articleWithObjectId);
            console.log(`Created article with ID: ${result.insertedId}`);
            return { ...articleWithObjectId, _id: result.insertedId };
        } catch (error) {
            console.error('Error in createArticle:', error);
            throw error;
        }
    }

    async updateArticle(id: string, updates: Partial<Article>) {
        if (!this.articles) throw new Error('Database not initialized');
        try {
            const objectId = new ObjectId(id);
            // Remove _id from updates and convert topicId to ObjectId
            const { _id, ...updatesWithoutId } = updates;
            const updatesWithObjectId = updatesWithoutId.topicId
                ? { ...updatesWithoutId, topicId: new ObjectId(updatesWithoutId.topicId) }
                : updatesWithoutId;
            const result = await this.articles.updateOne(
                { _id: objectId },
                { $set: updatesWithObjectId }
            );
            if (result.matchedCount === 0) {
                throw new Error('Article not found');
            }
            return this.articles.findOne({ _id: objectId });
        } catch (error) {
            console.error('Error in updateArticle:', error);
            throw error;
        }
    }

    // Delete methods
    async deleteLanguage(languageId: string) {
        if (!this.languages || !this.categories || !this.topics || !this.articles) {
            throw new Error('Database not initialized');
        }
        try {
            const id = new ObjectId(languageId);
            
            // Delete all related articles, topics, and categories
            const categories = await this.categories.find({ languageId: id }).toArray();
            const categoryIds = categories.map(cat => cat._id!);
            
            const topics = await this.topics.find({ categoryId: { $in: categoryIds } }).toArray();
            const topicIds = topics.map(topic => topic._id!);
            
            await this.articles.deleteMany({ topicId: { $in: topicIds } });
            await this.topics.deleteMany({ categoryId: { $in: categoryIds } });
            await this.categories.deleteMany({ languageId: id });
            
            const result = await this.languages.deleteOne({ _id: id });
            return result.deletedCount > 0;
        } catch (error) {
            console.error('Error in deleteLanguage:', error);
            throw error;
        }
    }

    async deleteCategory(categoryId: string) {
        if (!this.categories || !this.topics || !this.articles) {
            throw new Error('Database not initialized');
        }
        try {
            const id = new ObjectId(categoryId);
            
            // Delete all related articles and topics
            const topics = await this.topics.find({ categoryId: id }).toArray();
            const topicIds = topics.map(topic => topic._id!);
            
            await this.articles.deleteMany({ topicId: { $in: topicIds } });
            await this.topics.deleteMany({ categoryId: id });
            
            const result = await this.categories.deleteOne({ _id: id });
            return result.deletedCount > 0;
        } catch (error) {
            console.error('Error in deleteCategory:', error);
            throw error;
        }
    }

    async deleteTopic(topicId: string) {
        if (!this.topics || !this.articles) {
            throw new Error('Database not initialized');
        }
        try {
            const id = new ObjectId(topicId);
            
            // Delete all related articles
            await this.articles.deleteMany({ topicId: id });
            
            const result = await this.topics.deleteOne({ _id: id });
            return result.deletedCount > 0;
        } catch (error) {
            console.error('Error in deleteTopic:', error);
            throw error;
        }
    }

    async deleteArticle(articleId: string) {
        if (!this.articles) throw new Error('Database not initialized');
        try {
            const id = new ObjectId(articleId);
            const result = await this.articles.deleteOne({ _id: id });
            return result.deletedCount > 0;
        } catch (error) {
            console.error('Error in deleteArticle:', error);
            throw error;
        }
    }
}

export const dbService = new DatabaseService();
export default dbService; 