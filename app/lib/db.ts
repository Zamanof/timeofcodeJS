import { Language, Category, Topic, Article } from '../services/api';

export interface Admin {
  username: string;
  password: string;
  role: 'admin' | 'super_admin';
}

const API_BASE_URL = 'http://localhost:4000/api';

const defaultFetchOptions = {
    credentials: 'include' as const,
    headers: {
        'Content-Type': 'application/json'
    }
};

export async function getCollection(collection: 'languages' | 'categories' | 'topics' | 'articles') {
  const response = await fetch(`${API_BASE_URL}/${collection}`, defaultFetchOptions);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${collection}`);
  }
  return response.json();
}

export async function addToCollection(collection: 'languages' | 'categories' | 'topics' | 'articles', item: any) {
  const response = await fetch(`${API_BASE_URL}/${collection}`, {
    ...defaultFetchOptions,
    method: 'POST',
    body: JSON.stringify(item),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to add item to ${collection}`);
  }
  
  return response.json();
}

export async function updateCollection(collection: 'languages' | 'categories' | 'topics' | 'articles', items: any[]) {
  const response = await fetch(`${API_BASE_URL}/${collection}`, {
    ...defaultFetchOptions,
    method: 'PUT',
    body: JSON.stringify(items),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update ${collection}`);
  }
  
  return response.json();
} 