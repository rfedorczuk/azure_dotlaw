const sql = require('../../config/db'); // Make sure this points to your database configuration file

const Course = function(course) {
    this.course_id = course.course_id;
    this.title = course.title;
    this.description = course.description;
};

Course.findByVimeoId = async (vimeoId) => {
    console.log('findByVimeoId called with ID:', vimeoId);
    try {
        const [rows] = await sql.query("SELECT * FROM courses WHERE course_id = ?", [vimeoId]);
        console.log('Query result:', rows);
        return rows.length > 0 ? rows[0] : null;
    } catch (err) {
        console.error('Error querying the database:', err);
        throw err;
    }
};

Course.isCoursePrivate = async (courseId) => {
    try {
        const [rows] = await sql.query("SELECT is_private FROM courses WHERE course_id = ?", [courseId]);
        if (rows.length > 0) {
            return rows[0].is_private === 1; // true jeśli kurs jest prywatny
        }
        return false; // false jeśli kurs nie istnieje lub nie jest prywatny
    } catch (err) {
        console.error('Error querying the database:', err);
        throw err;
    }
};



Course.findByCourseId = async (courseId) => {
    try {
        const [rows] = await sql.query("SELECT * FROM courses WHERE course_id = ?", [courseId]);
        return rows.length > 0 ? rows[0] : null;
    } catch (err) {
        console.error('Error querying the database:', err);
        throw err;
    }
};

Course.findById = async (vimeoCourseId) => {
    try {
        const [rows] = await sql.query("SELECT id FROM courses WHERE course_id = ?", [vimeoCourseId]);
        console.log('findById', rows.length > 0 ? rows[0].id : null);
        return rows.length > 0 ? rows[0].id : null;
    } catch (err) {
        console.error('Error querying the database:', err);
        throw err;
    }
};

Course.create = async (courseData) => {
    console.log('courseData from model', courseData);
    try {
        const [existingCourses] = await sql.query("SELECT * FROM courses WHERE course_id = ?", [courseData.course_id]);
        if (existingCourses.length > 0) {
            console.log(`Course with course_id ${courseData.course_id} already exists.`);
            return existingCourses[0];
        }

        const [result] = await sql.query("INSERT INTO courses (course_id, title, description, created_at, updated_at) VALUES (?, ?, ?, DEFAULT, DEFAULT)", [courseData.course_id, courseData.title, courseData.description]);
        return { id: result.insertId, ...courseData };
    } catch (err) {
        console.error('Error in Course.create:', err);
        throw err;
    }
};

Course.enrollUser = async (userId, courseId) => {
    try {
        const [result] = await sql.query("INSERT INTO user_courses (user_id, course_id, enrollment_date, status, progress) VALUES (?, ?, DEFAULT, 'Nowy', 0.00)", [userId, courseId]);
        return { id: result.insertId, user_id: userId, course_id: courseId };
    } catch (err) {
        console.error('Error enrolling user:', err);
        throw err;
    }
};

Course.getUserCourses = async (userId) => {
    try {
        const [rows] = await sql.query('SELECT c.* FROM courses c JOIN user_courses uc ON c.course_id = uc.course_id WHERE uc.user_id = ?', [userId]);
        return rows;
    } catch (error) {
        console.error('Error executing SQL query:', error);
        throw error;
    }
};

Course.getAllCourses = async () => {
    try {
        const [rows] = await sql.query("SELECT * FROM courses");
        return rows;
    } catch (err) {
        console.error('Error querying the database for all courses:', err);
        throw err;
    }
};

Course.getFormattedDuration = async (courseId) => {
    try {
        const [rows] = await sql.query("SELECT total_duration FROM courses WHERE course_id = ?", [courseId]);
        if (rows.length > 0) {
            const totalSeconds = rows[0].total_duration;
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = Math.floor(totalSeconds % 60);
            return [(hours < 10 ? '0' : '') + hours, (minutes < 10 ? '0' : '') + minutes, (seconds < 10 ? '0' : '') + seconds].join(':');
        } else {
            return null;
        }
    } catch (err) {
        console.error('Error querying the database for total_duration:', err);
        throw err;
    }
};

Course.updateTotalDuration = async (courseId) => {
    console.log(`Updating total duration for course ID: ${courseId}`);
    try {
        // Obliczenie łącznego czasu trwania dla kursu
        const durationQuery = `
            SELECT SUM(duration) AS totalDuration
            FROM lessons
            WHERE course_id = ?
        `;
        const [durationResults] = await sql.query(durationQuery, [courseId]);
        const totalDuration = durationResults[0].totalDuration;

        // Aktualizacja łącznego czasu trwania w tabeli courses
        const updateQuery = `
            UPDATE courses
            SET total_duration = ?
            WHERE id = ?
        `;
        await sql.query(updateQuery, [totalDuration, courseId]);

        console.log(`Total duration for course ID ${courseId} updated to ${totalDuration}.`);
    } catch (error) {
        console.error(`Error updating total duration for course ID ${courseId}:`, error);
        throw error;
    }
};


module.exports = Course;
