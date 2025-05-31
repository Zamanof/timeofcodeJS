import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Use environment-specific API URL
const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://api.timeofcode.dev'  // Production API URL
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json(
                { error: 'Username and password are required' },
                { status: 400 }
            );
        }

        // Call the backend API directly
        const response = await fetch(`${API_BASE_URL}/api/admins/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': process.env.NODE_ENV === 'production' ? 'https://timeofcode.dev' : 'http://localhost:3000'
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to login');
        }

        const data = await response.json();
        
        // Set session cookie with appropriate domain
        cookies().set('admin_session', JSON.stringify({
            username: data.username,
            role: data.role
        }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            domain: process.env.NODE_ENV === 'production' ? '.timeofcode.dev' : undefined,
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
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: error instanceof Error && error.message === 'Invalid credentials' ? 401 : 500 }
        );
    }
}

// Add OPTIONS handler for CORS preflight
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
                ? 'https://timeofcode.dev' 
                : 'http://localhost:3000'
        }
    });
} 