import { promises as fs } from 'fs';
import path from 'path';
import { Language, Category, Topic, Article } from '../services/api';

export interface Admin {
  username: string;
  password: string;
  role: 'admin' | 'super_admin';
}

interface DbSchema {
  languages: Language[];
  categories: Category[];
  topics: Topic[];
  articles: Article[];
  admins: Admin[];
}

const DB_PATH = path.join(process.cwd(), 'db.json');

export const initializeDb = async () => {
  const defaultDb: DbSchema = {
    languages: [],
    categories: [],
    topics: [],
    articles: [],
    admins: [
      {
        username: 'Moguda',
        // In a real application, never store plain text passwords. Use bcrypt or similar.
        password: '123456',
        role: 'super_admin'
      }
    ]
  };

  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.writeFile(DB_PATH, JSON.stringify(defaultDb, null, 2));
  }
};

export const readDb = async (): Promise<DbSchema> => {
  await initializeDb();
  const data = await fs.readFile(DB_PATH, 'utf-8');
  return JSON.parse(data);
};

export const writeDb = async (db: DbSchema): Promise<void> => {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
};

export async function getCollection(collection: keyof DbSchema) {
  const db = await readDb();
  return db[collection];
}

export async function addToCollection(collection: keyof DbSchema, item: any) {
  const db = await readDb();
  db[collection].push(item);
  await writeDb(db);
  return item;
}

export async function updateCollection(collection: keyof DbSchema, items: any[]) {
  const db = await readDb();
  db[collection] = items;
  await writeDb(db);
  return items;
} 