import { config } from 'dotenv';
import { MongoClient } from 'mongodb';

config();

const MONGODB_URI = process.env.MONGODB_URI || '';
const DATABASE_NAME = process.env.DATABASE_NAME || 'timeofcode';

if (!MONGODB_URI) {
    console.error('MONGODB_URI environment variable is not set');
    process.exit(1);
}

let client: MongoClient | null = null;

export async function connectToDatabase() {
    try {
        console.log('Attempting to connect to MongoDB...');
        
        if (!client) {
            client = new MongoClient(MONGODB_URI, {
                // Add connection options for better reliability
                connectTimeoutMS: 5000,
                socketTimeoutMS: 30000,
                serverSelectionTimeoutMS: 5000,
                retryWrites: false
            });
            
            await client.connect();
            console.log('Connected to MongoDB successfully');
            
            const db = client.db(DATABASE_NAME);
            
            // Test the connection by running a simple command
            await db.command({ ping: 1 });
            console.log('Database connection verified');
            
            return db;
        }
        return client.db(DATABASE_NAME);
    } catch (error) {
        console.error('Failed to connect to MongoDB. Error details:');
        if (error instanceof Error) {
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            if (error.stack) {
                console.error('Stack trace:', error.stack);
            }
        }
        throw error;
    }
}

export async function closeDatabaseConnection() {
    if (client) {
        try {
            await client.close();
            client = null;
            console.log('Closed MongoDB connection');
        } catch (error) {
            console.error('Error closing MongoDB connection:', error);
            throw error;
        }
    }
}

// Handle process termination
process.on('SIGINT', async () => {
    await closeDatabaseConnection();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await closeDatabaseConnection();
    process.exit(0);
}); 