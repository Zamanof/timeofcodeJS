import { connectToDatabase } from '../config/database';
import { hash } from 'bcrypt';

async function initializeAdmin() {
    try {
        const db = await connectToDatabase();
        console.log('Connected to database successfully');

        // Create admins collection if it doesn't exist
        try {
            await db.createCollection('admins');
            console.log('Created admins collection');
        } catch (error) {
            console.log('Admins collection already exists');
        }

        const admins = db.collection('admins');

        // Hash the password
        const hashedPassword = await hash('123456', 10);

        // Check if admin already exists
        const existingAdmin = await admins.findOne({ username: 'Moguda' });
        
        if (existingAdmin) {
            console.log('Admin user already exists, updating password...');
            await admins.updateOne(
                { username: 'Moguda' },
                { 
                    $set: { 
                        password: hashedPassword,
                        role: 'super_admin',
                        updatedAt: new Date()
                    }
                }
            );
        } else {
            console.log('Creating new admin user...');
            await admins.insertOne({
                username: 'Moguda',
                password: hashedPassword,
                role: 'super_admin',
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }

        console.log('Admin user setup completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Failed to initialize admin:', error);
        process.exit(1);
    }
}

initializeAdmin(); 