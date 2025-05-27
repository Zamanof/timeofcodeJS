import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import express from 'express';
import cors from 'cors';
import apiRouter from '../routes/api';
import { dbService } from '../models/db';

const app = express();

// CORS configuration
const corsOptions = {
    origin: ['https://your-app-name.azurestaticapps.net', 'http://localhost:3000', 'http://localhost:4280'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', apiRouter);

// Initialize database
dbService.initialize().catch(error => {
    console.error('Failed to initialize database:', error);
});

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    // Create a mock response object
    const res: any = {
        status: function (status: number) {
            context.res = {
                status,
                body: undefined,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return this;
        },
        json: function (body: any) {
            if (context.res) {
                context.res.body = body;
            }
            return this;
        },
        send: function (body: any) {
            if (context.res) {
                context.res.body = body;
            }
            return this;
        },
        set: function (header: string, value: string) {
            if (context.res) {
                context.res.headers = context.res.headers || {};
                context.res.headers[header] = value;
            }
            return this;
        }
    };

    // Route the request through the Express app
    await new Promise((resolve, reject) => {
        app(req, res, (err: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(undefined);
            }
        });
    });

    // If no response was set, return a 404
    if (!context.res) {
        context.res = {
            status: 404,
            body: {
                error: 'Not Found',
                path: req.url
            }
        };
    }
};

export default httpTrigger; 