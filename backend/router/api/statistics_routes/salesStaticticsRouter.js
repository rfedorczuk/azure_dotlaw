const express = require('express');
const router = express.Router();
const pool = require('../../../config/db');

// Endpoint do pobierania statystyk sprzedaży
router.get("/test", (req, res) => {
    res.json({ message: "stat WORKS." });
});

router.get('/sales-statistics', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT DATE(enrollment_date) AS date, COUNT(*) AS sales
            FROM user_courses
            GROUP BY DATE(enrollment_date)
            ORDER BY DATE(enrollment_date);
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error when fetching sales statistics:', error);
        res.status(500).send('Server error');
    }
});

// router.get('/check-db-connection', async (req, res) => {
//     try {
//         const connection = await pool.getConnection();
//         const [rows] = await connection.query('SELECT 1 + 1 AS solution');
//         connection.release(); // Pamiętaj, aby zawsze zwalniać połączenie po użyciu
//         res.status(200).json({
//             message: 'Połączenie z bazą danych zostało nawiązane pomyślnie.',
//             solution: rows[0].solution
//         });
//     } catch (error) {
//         res.status(500).json({
//             message: 'Nie udało się nawiązać połączenia z bazą danych.',
//             error: error.message
//         });
//     }
// });

module.exports = router;
