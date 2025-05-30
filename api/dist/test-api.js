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
const axios_1 = __importDefault(require("axios"));
const API_URL = 'http://localhost:4000/api';
function testEndpoints() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Test 1: Get all languages
            console.log('\n1. Testing GET /languages');
            const languagesResponse = yield axios_1.default.get(`${API_URL}/languages`);
            console.log('Languages:', languagesResponse.data);
            if (languagesResponse.data.length === 0) {
                throw new Error('No languages found');
            }
            const firstLanguage = languagesResponse.data[0];
            console.log(`First language ID: ${firstLanguage.id}`);
            // Test 2: Get categories for the first language
            console.log('\n2. Testing GET /languages/:languageId/categories');
            const categoriesResponse = yield axios_1.default.get(`${API_URL}/languages/${firstLanguage.id}/categories`);
            console.log('Categories:', categoriesResponse.data);
            if (categoriesResponse.data.length === 0) {
                throw new Error('No categories found');
            }
            const firstCategory = categoriesResponse.data[0];
            console.log(`First category ID: ${firstCategory.id}`);
            // Test 3: Get topics for the first category
            console.log('\n3. Testing GET /categories/:categoryId/topics');
            const topicsResponse = yield axios_1.default.get(`${API_URL}/categories/${firstCategory.id}/topics`);
            console.log('Topics:', topicsResponse.data);
            if (topicsResponse.data.length === 0) {
                throw new Error('No topics found');
            }
            const firstTopic = topicsResponse.data[0];
            console.log(`First topic ID: ${firstTopic.id}`);
            // Test 4: Get articles for the first topic
            console.log('\n4. Testing GET /topics/:topicId/articles');
            const articlesResponse = yield axios_1.default.get(`${API_URL}/topics/${firstTopic.id}/articles`);
            console.log('Articles:', articlesResponse.data);
            if (articlesResponse.data.length === 0) {
                throw new Error('No articles found');
            }
            const firstArticle = articlesResponse.data[0];
            console.log(`First article ID: ${firstArticle.id}`);
            // Test 5: Get article with code examples
            console.log('\n5. Testing GET /articles/:articleId');
            const articleResponse = yield axios_1.default.get(`${API_URL}/articles/${firstArticle.id}`);
            console.log('Article with code examples:', articleResponse.data);
            if (!articleResponse.data.codeExamples) {
                throw new Error('No code examples found');
            }
            console.log('\n✅ All API endpoints tested successfully!');
        }
        catch (err) {
            if (err instanceof Error) {
                console.error('\n❌ Error testing API endpoints:', err.message);
            }
            const error = err;
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
            }
        }
    });
}
// Run the tests
testEndpoints();
//# sourceMappingURL=test-api.js.map