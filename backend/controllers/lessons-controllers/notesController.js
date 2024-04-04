// notesController.js
const pool = require('../../config/db');

const notesController = {
    createNote: async (req, res) => {
        const { user_id, course_id, content } = req.body;
        const query = 'INSERT INTO notes (user_id, course_id, content) VALUES (?, ?, ?)';
        try {
            const [result] = await pool.query(query, [user_id, course_id, content]);
            res.send({ message: 'Notatka zapisana', noteId: result.insertId });
        } catch (err) {
            console.error('Error creating note:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    getNotes: async (req, res) => {
        const { userId, courseId } = req.params;
        const query = 'SELECT * FROM notes WHERE user_id = ? AND course_id = ?';
        try {
            const [results] = await pool.query(query, [userId, courseId]);
            res.send(results);
        } catch (err) {
            console.error('Error fetching notes:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = notesController;
