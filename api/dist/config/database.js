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
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = connectToDatabase;
exports.closeDatabase = closeDatabase;
const dotenv_1 = require("dotenv");
const mongodb_1 = require("mongodb");
// Load environment variables
(0, dotenv_1.config)();
const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.DATABASE_NAME || 'timeofcode';
if (!MONGODB_URI) {
    console.error('MONGODB_URI environment variable is not set');
    process.exit(1);
}
let client = null;
let db = null;
function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (db) {
                console.log('Using existing database connection');
                return db;
            }
            console.log('Connecting to MongoDB...');
            client = new mongodb_1.MongoClient(MONGODB_URI, {
                // Add connection options for better reliability
                connectTimeoutMS: 5000,
                socketTimeoutMS: 30000,
                serverSelectionTimeoutMS: 5000,
                retryWrites: false
            });
            yield client.connect();
            console.log('Connected to MongoDB successfully');
            db = client.db(DATABASE_NAME);
            console.log(`Connected to database: ${DATABASE_NAME}`);
            // Test the connection
            yield db.command({ ping: 1 });
            console.log('Database connection verified');
            return db;
        }
        catch (error) {
            console.error('Failed to connect to MongoDB:', error);
            throw error;
        }
    });
}
function closeDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        if (client) {
            try {
                yield client.close();
                client = null;
                db = null;
                console.log('Closed MongoDB connection');
            }
            catch (error) {
                console.error('Error closing MongoDB connection:', error);
                throw error;
            }
        }
    });
}
// Handle process termination
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    yield closeDatabase();
    process.exit(0);
}));
process.on('SIGTERM', () => __awaiter(void 0, void 0, void 0, function* () {
    yield closeDatabase();
    process.exit(0);
}));
//# sourceMappingURL=database.js.map