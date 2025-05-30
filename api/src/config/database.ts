import { config } from 'dotenv';
import { MongoClient, Db } from 'mongodb';

// Load environment variables
config();

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.DATABASE_NAME || 'timeofcode';

if (!MONGODB_URI) {
    console.error('MONGODB_URI environment variable is not set');
    process.exit(1);
}

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
    try {
        if (db) {
            console.log('Using existing database connection');
            return db;
        }

        console.log('Connecting to MongoDB...');
        client = new MongoClient(MONGODB_URI, {
            // Add connection options for better reliability
            connectTimeoutMS: 5000,
            socketTimeoutMS: 30000,
            serverSelectionTimeoutMS: 5000,
            retryWrites: false
        });

        await client.connect();
        console.log('Connected to MongoDB successfully');

        db = client.db(DATABASE_NAME);
        console.log(`Connected to database: ${DATABASE_NAME}`);

        // Test the connection
        await db.command({ ping: 1 });
        console.log('Database connection verified');

        return db;
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
    }
}

export async function closeDatabase(): Promise<void> {
    if (client) {
        try {
            await client.close();
            client = null;
            db = null;
            console.log('Closed MongoDB connection');
        } catch (error) {
            console.error('Error closing MongoDB connection:', error);
            throw error;
        }
    }
}

// Handle process termination
process.on('SIGINT', async () => {
    await closeDatabase();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await closeDatabase();
    process.exit(0);
}); 