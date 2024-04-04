// /config/db.js
// require('dotenv').config(); 
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

console.log(process.env.MYSQL_HOST, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, process.env.MYSQL_DATABASE);

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    ssl: {
        ca: fs.readFileSync(path.join(__dirname, '..', 'config', 'DigiCertGlobalRootCA.crt.pem'))
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Funkcja testująca połączenie z bazą danych
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        await connection.query('SELECT 1');
        console.log('Połączenie z bazą danych zostało nawiązane pomyślnie.');
        connection.release();
    } catch (error) {
        console.error('Nie udało się nawiązać połączenia z bazą danych:', error.message);
    }
}

// Wywołaj funkcję testującą przy starcie aplikacji
testConnection();

module.exports = pool;

// const mysql = require('mysql2/promise');
// const fs = require('fs');
// const path = require('path');

// console.log('Pula połączeń MySQL została skonfigurowana:');
// console.log(`Host: ${process.env.MYSQL_HOST}`);
// console.log(`Baza danych: ${process.env.MYSQL_DATABASE}`);
// const pool = mysql.createPool({
//     host: process.env.MYSQL_HOST,
//     user: process.env.MYSQL_USER,
//     password: process.env.MYSQL_PASSWORD,
//     database: process.env.MYSQL_DATABASE,
//     ssl: {
//         ca: fs.readFileSync(path.join(__dirname, '..', 'config', 'DigiCertGlobalRootCA.crt.pem'))
//     },
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });
// module.exports = pool;


// /config/db.js
// const mysql = require('mysql2/promise');

// const pool = mysql.createPool({
//     host: '172.16.189.234',      
//     user: 'root', 
//     password: 'ErYte7!te', 
//     database: 'dotlaw', 
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });

// module.exports = pool;
