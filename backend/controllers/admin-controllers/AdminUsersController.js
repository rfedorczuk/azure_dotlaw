// controllers/userController.js
const db = require('../../config/db');

exports.getActiveCoursesInfo = async (req, res) => {
    try {
        const query = `
            SELECT 
                u.id,
                u.avatar,
                u.name,
                u.surname,
                u.email,
                u.role,
                u.created_at,
                COUNT(uc.id) AS active_courses_count
            FROM 
                users u
            LEFT JOIN 
                user_courses uc ON u.id = uc.user_id AND uc.status IN ('W trakcie', 'Nowy')
            GROUP BY 
                u.id;
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    const { userId } = req.params;
    console.log('Attempting to delete user with ID:', userId);

    let conn;
    try {
        conn = await db.getConnection();
        await conn.beginTransaction();
        console.log(`Transaction started for deleting user with ID: ${userId}`);

        // Usuwanie powiązań z tabeli transactions
        let result = await conn.query('DELETE FROM transactions WHERE user_id = ?', [userId]);
        console.log(`Deleted ${result[0].affectedRows} entries from transactions for user ID: ${userId}`);

        // Usuwanie powiązań z tabeli user_courses
        result = await conn.query('DELETE FROM user_courses WHERE user_id = ?', [userId]);
        console.log(`Deleted ${result[0].affectedRows} entries from user_courses for user ID: ${userId}`);

        // Usuwanie powiązań z tabeli user_vouchers
        result = await conn.query('DELETE FROM user_vouchers WHERE user_id = ?', [userId]);
        console.log(`Deleted ${result[0].affectedRows} entries from user_vouchers for user ID: ${userId}`);

        // Usuwanie powiązań z tabeli user_lessons_progress
        result = await conn.query('DELETE FROM user_lessons_progress WHERE user_id = ?', [userId]);
        console.log(`Deleted ${result[0].affectedRows} entries from user_lessons_progress for user ID: ${userId}`);

        // Usuwanie użytkownika z tabeli users
        result = await conn.query('DELETE FROM users WHERE id = ?', [userId]);
        console.log(`Deleted ${result[0].affectedRows} user(s) with ID: ${userId}`);

        await conn.commit();
        console.log(`Transaction committed for deleting user with ID: ${userId}`);
        res.send({ message: 'User successfully deleted' });
    } catch (error) {
        if (conn) {
            await conn.rollback();
            console.log(`Transaction rolled back for user ID: ${userId} due to error: ${error.message}`);
        }
        console.error('Error deleting user:', error);
        res.status(500).send({ message: 'Error deleting user' });
    } finally {
        if (conn) {
            conn.release();
        }
    }
};



