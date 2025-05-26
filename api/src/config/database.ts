import { config } from 'dotenv';
import { MongoClient } from 'mongodb';

config(); // Load environment variables

// MongoDB connection string for Azure Cosmos DB
const MONGODB_URI = 'mongodb+srv://moguda:Z%40man0v0643@timeofcodedb.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000';
const DATABASE_NAME = 'timeofcode';

let client: MongoClient | null = null;

export async function connectToDatabase() {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('Using database:', DATABASE_NAME);
        
        if (!client) {
            client = new MongoClient(MONGODB_URI);
            console.log('Created MongoDB client instance');
            
            await client.connect();
            console.log('Connected to MongoDB successfully');
            
            const db = client.db(DATABASE_NAME);
            console.log('Accessed database:', DATABASE_NAME);
            
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