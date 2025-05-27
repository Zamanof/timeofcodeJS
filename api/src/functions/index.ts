import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { dbService } from '../models/db';

// Initialize database connection
dbService.initialize().catch(error => {
    console.error('Failed to initialize database:', error);
});

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request:', req.method, req.url);

    try {
        const path = req.params.route || '';
        const method = req.method?.toLowerCase();

        // CORS headers
        context.res = {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        };

        // Handle OPTIONS requests for CORS
        if (method === 'options') {
            context.res.status = 200;
            return;
        }

        // Route handling
        if (path === 'health') {
            context.res.json({
                status: 'ok',
                timestamp: new Date().toISOString()
            });
            return;
        }

        // Handle API routes
        if (path.startsWith('languages')) {
            const result = await handleLanguagesRoute(path, method, req.body);
            context.res.json(result);
            return;
        }

        if (path.startsWith('categories')) {
            const result = await handleCategoriesRoute(path, method, req.body);
            context.res.json(result);
            return;
        }

        if (path.startsWith('topics')) {
            const result = await handleTopicsRoute(path, method, req.body);
            context.res.json(result);
            return;
        }

        if (path.startsWith('articles')) {
            const result = await handleArticlesRoute(path, method, req.body);
            context.res.json(result);
            return;
        }

        // 404 for unmatched routes
        context.res = {
            status: 404,
            body: {
                error: 'Not Found',
                path: req.url
            }
        };

    } catch (error) {
        context.log.error('Error processing request:', error);
        context.res = {
            status: 500,
            body: {
                error: 'Internal Server Error',
                message: process.env.NODE_ENV === 'development' ? error.message : undefined
            }
        };
    }
};

// Route handlers
async function handleLanguagesRoute(path: string, method: string, body?: any) {
    // Implement your language routes here
    return { message: 'Languages route' };
}

async function handleCategoriesRoute(path: string, method: string, body?: any) {
    // Implement your category routes here
    return { message: 'Categories route' };
}

async function handleTopicsRoute(path: string, method: string, body?: any) {
    // Implement your topics routes here
    return { message: 'Topics route' };
}

async function handleArticlesRoute(path: string, method: string, body?: any) {
    // Implement your articles routes here
    return { message: 'Articles route' };
}

export default httpTrigger; 