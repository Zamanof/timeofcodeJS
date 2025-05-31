import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Use environment-specific API URL
const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://api.timeofcode.dev'  // Production API URL
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');

// Add debugging
console.log('API Route loaded, API_BASE_URL:', API_BASE_URL);

export async function POST(request: NextRequest) {
    console.log('POST request received at /api/auth');
    
    try {
        const body = await request.json();
        console.log('Request body:', body);
        
        const { username, password } = body;

        if (!username || !password) {
            console.log('Missing username or password');
            return NextResponse.json(
                { error: 'Username and password are required' },
                { status: 400 }
            );
        }

        const loginUrl = `${API_BASE_URL}/api/admins/login`;
        console.log('Attempting login at:', loginUrl);

        // Call the backend API directly
        const response = await fetch(loginUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': process.env.NODE_ENV === 'production' ? 'https://timeofcode.dev' : 'http://localhost:3000'
            },
            body: JSON.stringify({ username, password })
        });

        console.log('Login response status:', response.status);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to login');
        }

        const data = await response.json();
        console.log('Login successful for user:', data.username);
        
        // Set session cookie with appropriate domain
        cookies().set('admin_session', JSON.stringify({
            username: data.username,
            role: data.role
        }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
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
export async function OPTIONS(request: NextRequest) {
    console.log('OPTIONS request received at /api/auth');
    
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true'
        }
    });
} 