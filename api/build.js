const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure the dist directory exists
if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
}

// Ensure the dist/functions directory exists
if (!fs.existsSync('dist/functions')) {
    fs.mkdirSync('dist/functions', { recursive: true });
}

try {
    // Clean install dependencies
    console.log('Installing dependencies...');
    execSync('npm cache clean --force', { stdio: 'inherit' });
    execSync('rm -rf node_modules package-lock.json', { stdio: 'inherit' });
    execSync('npm install --no-package-lock', { stdio: 'inherit' });
    
    // Ensure @azure/functions is installed
    console.log('Ensuring Azure Functions dependencies...');
    execSync('npm install @azure/functions@latest --save --no-package-lock', { stdio: 'inherit' });

    // Run TypeScript compilation
    console.log('Compiling TypeScript...');
    execSync('npx tsc', { stdio: 'inherit' });

    // Copy function.json to the correct location
    console.log('Copying function configuration...');
    if (fs.existsSync('src/function.json')) {
        fs.copyFileSync('src/function.json', 'dist/functions/function.json');
    }

    console.log('Build completed successfully!');
} catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
} 