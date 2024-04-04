// models/courseModel.js
const pool = require('../../config/db');

const getCoursesWithCount = async () => {
    const query = `
   SELECT 
    c.id,
    c.course_id, 
    c.title, 
    c.user_limit,
    c.created_at, 
    cc.code AS course_code, -- Course code from the course_codes table
    COUNT(DISTINCT uc.user_id) as user_count, -- Count of distinct users enrolled in the course
    (SELECT COUNT(DISTINCT id) FROM users) as total_user_count, -- Total count of users
    CASE 
        WHEN EXISTS (SELECT 1 FROM questions q WHERE q.course_id = c.course_id) THEN 'TAK'
        ELSE 'NIE'
    END AS has_exam -- Checks if the course has an exam based on the questions table
FROM 
    courses c
LEFT JOIN 
    user_courses uc ON c.course_id = uc.course_id -- Left join to include all courses
LEFT JOIN 
    course_codes cc ON c.course_id = cc.course_id -- Left join to include the course code
GROUP BY 
    c.course_id, c.title, c.created_at, cc.code;
    `;
    const [rows] = await pool.query(query);
    return rows;
};

module.exports = {
    getCoursesWithCount
};