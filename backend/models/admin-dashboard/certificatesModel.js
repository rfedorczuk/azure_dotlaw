// models/certificatesModel.js
const pool = require('../../config/db');

class Certificates {
    static async getCoursesInfo() {
        const query = `
            SELECT 
                c.id,
                c.title AS course_title,
                COUNT(uc.id) AS users_assigned,
                SUM(CASE WHEN uc.certificate_blob IS NOT NULL THEN 1 ELSE 0 END) AS users_completed
            FROM 
                courses c
            LEFT JOIN 
                user_courses uc ON c.course_id = uc.course_id
            GROUP BY 
                c.id;
        `;

        try {
            const [results] = await pool.query(query);
            return results;
        } catch (error) {
            console.error("Error fetching courses info: ", error);
            throw error;
        }
    }
}

module.exports = Certificates;
