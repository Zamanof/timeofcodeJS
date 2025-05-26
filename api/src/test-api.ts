import axios from 'axios';
import { Language, Category, Topic, Article } from './models/types';

const API_URL = 'http://localhost:4000/api';

async function testEndpoints() {
    try {
        // Test 1: Get all languages
        console.log('\n1. Testing GET /languages');
        const languagesResponse = await axios.get<Language[]>(`${API_URL}/languages`);
        console.log('Languages:', languagesResponse.data);

        if (languagesResponse.data.length === 0) {
            throw new Error('No languages found');
        }

        const firstLanguage = languagesResponse.data[0];
        console.log(`First language ID: ${firstLanguage.id}`);

        // Test 2: Get categories for the first language
        console.log('\n2. Testing GET /languages/:languageId/categories');
        const categoriesResponse = await axios.get<Category[]>(`${API_URL}/languages/${firstLanguage.id}/categories`);
        console.log('Categories:', categoriesResponse.data);

        if (categoriesResponse.data.length === 0) {
            throw new Error('No categories found');
        }

        const firstCategory = categoriesResponse.data[0];
        console.log(`First category ID: ${firstCategory.id}`);

        // Test 3: Get topics for the first category
        console.log('\n3. Testing GET /categories/:categoryId/topics');
        const topicsResponse = await axios.get<Topic[]>(`${API_URL}/categories/${firstCategory.id}/topics`);
        console.log('Topics:', topicsResponse.data);

        if (topicsResponse.data.length === 0) {
            throw new Error('No topics found');
        }

        const firstTopic = topicsResponse.data[0];
        console.log(`First topic ID: ${firstTopic.id}`);

        // Test 4: Get articles for the first topic
        console.log('\n4. Testing GET /topics/:topicId/articles');
        const articlesResponse = await axios.get<Article[]>(`${API_URL}/topics/${firstTopic.id}/articles`);
        console.log('Articles:', articlesResponse.data);

        if (articlesResponse.data.length === 0) {
            throw new Error('No articles found');
        }

        const firstArticle = articlesResponse.data[0];
        console.log(`First article ID: ${firstArticle.id}`);

        // Test 5: Get article with code examples
        console.log('\n5. Testing GET /articles/:articleId');
        const articleResponse = await axios.get<Article & { codeExamples: any[] }>(`${API_URL}/articles/${firstArticle.id}`);
        console.log('Article with code examples:', articleResponse.data);

        if (!articleResponse.data.codeExamples) {
            throw new Error('No code examples found');
        }

        console.log('\n✅ All API endpoints tested successfully!');
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('\n❌ Error testing API endpoints:', err.message);
        }
        
        const error = err as any;
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
    }
}

// Run the tests
testEndpoints(); 