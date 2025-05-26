const sql = require('mssql');

const config = {
    server: 'MOGUDA_PC',
    database: 'timeofcode',
    options: {
        encrypt: false, // Disable encryption
        trustServerCertificate: true,
        enableArithAbort: true,
        trustedConnection: true,
        integratedSecurity: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

console.log('Attempting to connect to database...');

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to MSSQL Database');
        return pool;
    })
    .catch(err => {
        console.error('Database Connection Failed:', err);
        process.exit(1); // Exit if we can't connect to the database
    });

module.exports = {
    sql,
    poolPromise
}; 