const sql = require('mssql');
require('dotenv').config();

const config = {
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_DATABASE || 'QuanLyTro',
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_CERTIFICATE === 'true',
        enableArithAbort: true,
        trustedConnection: true,
        instanceName: process.env.DB_INSTANCE || ''
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

// Nếu có DB_USER và DB_PASSWORD thì dùng SQL Authentication
if (process.env.DB_USER && process.env.DB_PASSWORD) {
    config.user = process.env.DB_USER;
    config.password = process.env.DB_PASSWORD;
    config.options.trustedConnection = false;
    if (process.env.DB_PORT) {
        config.port = parseInt(process.env.DB_PORT);
    }
}

let pool = null;

const getConnection = async () => {
    try {
        if (pool) {
            return pool;
        }
        pool = await sql.connect(config);
        console.log('Connected to SQL Server successfully');
        return pool;
    } catch (err) {
        console.error('Database connection failed:', err);
        throw err;
    }
};

const closeConnection = async () => {
    try {
        if (pool) {
            await pool.close();
            pool = null;
            console.log('Database connection closed');
        }
    } catch (err) {
        console.error('Error closing database connection:', err);
    }
};

module.exports = {
    sql,
    getConnection,
    closeConnection
};
