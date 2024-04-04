// lesson.js - Plik modelu lekcji
const sql = require('../../config/db'); // Upewnij się, że ścieżka jest poprawna

const Lesson = function(lesson) {
    this.course_id = lesson.course_id;
    this.lesson_id = lesson.lesson_id;
    this.title = lesson.title;
    this.duration = lesson.duration;
};

Lesson.create = async (lessonData) => {
    console.log('lessonData z modelu:', lessonData);
    const query = "INSERT INTO lessons (course_id, lesson_id, title, duration) VALUES (?, ?, ?, ?)";
    try {
        const [res] = await sql.execute(query, [lessonData.course_id, lessonData.lesson_id, lessonData.title, lessonData.duration]);
        console.log('Lesson created with ID:', res.insertId);
        return { id: res.insertId, ...lessonData };
    } catch (err) {
        console.error('Error creating lesson in DB:', err);
        throw err; // Rzucenie wyjątku pozwala na obsługę błędów na wyższym poziomie
    }
};

module.exports = Lesson;
