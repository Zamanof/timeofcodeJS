module.exports = {
  apps: [
    {
      name: 'timeofcode-web',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/timeofcodeJS',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'timeofcode-api',
      script: 'dist/index.js',
      cwd: '/var/www/timeofcodeJS/api',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    }
  ]
}; 