import { NextResponse } from 'next/server';
import { compare } from 'bcrypt';
import { cookies } from 'next/headers';

const API_BASE_URL = 'http://localhost:5000/api';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        // Fetch admin from MongoDB
        const response = await fetch(`${API_BASE_URL}/admins/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const data = await response.json();
        
        // Set session cookie
        cookies().set('admin_session', JSON.stringify({
            username: data.username,
            role: data.role
        }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 // 7 days
        });

        return NextResponse.json({
            user: {
                username: data.username,
                role: data.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 