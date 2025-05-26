"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = connectToDatabase;
exports.closeDatabaseConnection = closeDatabaseConnection;
const dotenv_1 = require("dotenv");
const mongodb_1 = require("mongodb");
(0, dotenv_1.config)(); // Load environment variables
// Use environment variable if set, otherwise fallback to local MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/timeofcode';
const DATABASE_NAME = process.env.DB_NAME || 'timeofcode';
let client = null;
async function connectToDatabase() {
    try {
        if (!client) {
            console.log('Connecting to MongoDB...');
            client = new mongodb_1.MongoClient(MONGODB_URI, {
                maxPoolSize: 10,
                minPoolSize: 0,
                maxIdleTimeMS: 120000
            });
            await client.connect();
            console.log('Connected to MongoDB successfully');
        }
        return client.db(DATABASE_NAME);
    }
    catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
    }
}
async function closeDatabaseConnection() {
    if (client) {
        try {
            await client.close();
            client = null;
            console.log('Closed MongoDB connection');
        }
        catch (error) {
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
