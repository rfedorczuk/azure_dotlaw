const pool = require('../../config/db'); // Zaimportuj konfigurację połączenia z bazą danych

const saveUserCourseProgress = async (userId, courseId, lessonId, progress) => {
  console.log('userId', userId, 'courseId', courseId, 'lessonId', lessonId, 'progress', progress);
  const query = `UPDATE user_courses SET progress = ?, lesson_id = ? WHERE user_id = ? AND course_id = ?`;
  try {
    const [results] = await pool.query(query, [progress, lessonId, userId, courseId]);
    console.log('Progress saved');
    return results;
  } catch (error) {
    console.error('Error saving progress:', error);
    throw error;
  }
};



// Add to progressModel.js

// Assuming this is in progressModel.js

const getUserCourseProgress = async (userId, courseId) => {
  const query = `SELECT progress FROM user_courses WHERE user_id = ? AND course_id = ? LIMIT 1`;
  try {
    const [results] = await pool.query(query, [userId, courseId]);
    if (results.length > 0) {
      return results[0].progress; // Zakładając, że 'progress' to nazwa pola
    } else {
      return null; // Zwraca null, jeśli nie znaleziono wyników
    }
  } catch (error) {
    console.error('Błąd podczas pobierania postępu:', error);
    throw error; // Rzuca błąd do dalszego obsłużenia
  }
};

const getUserLessonProgress = async (userId, lessonId) => {
  const query = `SELECT progress FROM user_lessons_progress WHERE user_id = ? AND lesson_id = ? LIMIT 1`;
  try {
    const [results] = await pool.query(query, [userId, lessonId]);
    if (results.length > 0) {
      return results[0].progress; // Zwraca postęp dla danej lekcji
    } else {
      return 0; // Zwraca 0, jeśli nie znaleziono wyników, co oznacza, że lekcja nie została jeszcze rozpoczęta
    }
  } catch (error) {
    console.error('Błąd podczas pobierania postępu lekcji:', error);
    throw error; // Rzuca błąd do dalszego obsłużenia
  }
};

const getCourseInternalId = async (courseExternalId) => {
  console.log('getCourseInternalId ',courseExternalId)
  const query = `SELECT id FROM courses WHERE course_id = ? LIMIT 1`;
  try {
    const [results] = await pool.query(query, [courseExternalId]);
    if (results.length > 0) {
      console.log('>0 ',results[0].id)
      return results[0].id; // Zwraca wewnętrzne ID kursu
    } else {
      console.log('nie znaleziono null')
      return null; // Zwraca null, jeśli kurs nie został znaleziony
    }
  } catch (error) {
    console.error('Error fetching course internal ID:', error);
    throw error;
  }
};

const getCourseExternalId = async (courseInternalId) => {
  console.log('getCourseExternalId ',courseInternalId)
  const query = `SELECT course_id FROM courses WHERE id = ? LIMIT 1`;
  try {
    const [results] = await pool.query(query, [courseInternalId]);
    if (results.length > 0) {
      console.log('>0 courseInternalId',results[0].id)
      return results[0].course_id; // Zwraca wewnętrzne ID kursu
    } else {
      console.log('nie znaleziono courseInternalId')
      return null; // Zwraca null, jeśli kurs nie został znaleziony
    }
  } catch (error) {
    console.error('Error fetching course external ID:', error);
    throw error;
  }
};


const updateLessonProgress = async (lessonId, progress) => {
  const query = `UPDATE lessons SET progress = ? WHERE id = ?`;
  await pool.query(query, [progress, lessonId]);
};

// Add to progressModel.js

// Zapisz postęp pojedynczej lekcji
const saveLessonProgress = async (userId, courseId, lessonId, progress) => {
  console.log('saveLessonProgress')
  // Sprawdź, czy istnieje wpis, jeśli nie, utwórz go
  const checkQuery = `SELECT id FROM user_lessons_progress WHERE user_id = ? AND lesson_id = ? LIMIT 1`;
  const [checkResult] = await pool.query(checkQuery, [userId, lessonId]);

  if (checkResult.length === 0) {
    console.log('checkResult.length === 0')
    // Utwórz nowy wpis
    console.log('insert ',userId, lessonId, progress)
    const insertQuery = `INSERT INTO user_lessons_progress (user_id, lesson_id, progress) VALUES (?, ?, ?)`;
    await pool.query(insertQuery, [userId, lessonId, progress]);
  } else {
    console.log('Aktualizuj istniejący wpis')
    // Aktualizuj istniejący wpis
    const updateQuery = `UPDATE user_lessons_progress SET progress = ? WHERE user_id = ? AND lesson_id = ?`;
    await pool.query(updateQuery, [progress, userId, lessonId]);
  }
};

const calculateTotalCourseProgress = async (userId, courseId) => {
  const query = `SELECT AVG(progress) AS totalProgress FROM user_lessons_progress
                 JOIN lessons ON user_lessons_progress.lesson_id = lessons.id
                 WHERE lessons.course_id = ? AND user_lessons_progress.user_id = ?`;
  const [results] = await pool.query(query, [courseId, userId]);
  return results[0].totalProgress || 0;
};

const updateTotalProgressInCourse = async (userId, externalCourseId) => {
  try {
    // Znajdź wewnętrzne `id` kursu na podstawie zewnętrznego `course_id`
    const courseId = await getCourseExternalId(externalCourseId);
    console.log('courseId ',courseId, '  externalCourseId ',externalCourseId)

    // Oblicz łączny czas spędzony przez użytkownika na oglądaniu lekcji w danym kursie
    const progressQuery = `
      SELECT SUM(user_lessons_progress.progress) AS totalTimeSpent
      FROM user_lessons_progress
      JOIN lessons ON user_lessons_progress.lesson_id = lessons.lesson_id
      WHERE lessons.course_id = ? AND user_lessons_progress.user_id = ?;
    `;
    const [progressResults] = await pool.query(progressQuery, [externalCourseId, userId]);
    const totalTimeSpent = progressResults[0].totalTimeSpent || 0;

    // Aktualizuj całkowity czas spędzony na kursie (total_progress) w user_courses
    const updateQuery = `
      UPDATE user_courses
      SET total_progress = ?
      WHERE user_id = ? AND course_id = ?;
    `;
    await pool.query(updateQuery, [totalTimeSpent, userId, courseId]);
    console.log(`Total time spent by user ${userId} in course with external ID ${courseId} updated to ${totalTimeSpent}`);
  } catch (error) {
    console.error('Error updating total course progress:', error);
    throw error;
  }
};

const updateCourseStatusForUser = async (userId, externalCourseId) => {
  try {
    const courseId = await getCourseExternalId(externalCourseId);

    // Pobierz całkowity czas trwania kursu
    const totalDurationQuery = `SELECT total_duration FROM courses WHERE course_id = ? LIMIT 1`;
    const [durationResults] = await pool.query(totalDurationQuery, [courseId]);
    if (durationResults.length === 0) {
      throw new Error('Course not found.');
    }
    const totalDuration = durationResults[0].total_duration;

    // Pobierz całkowity postęp użytkownika w kursie
    const totalProgressQuery = `SELECT total_progress FROM user_courses WHERE user_id = ? AND course_id = ? LIMIT 1`;
    const [progressResults] = await pool.query(totalProgressQuery, [userId, courseId]);
    if (progressResults.length === 0) {
      throw new Error('User course progress not found.');
    }

    const totalProgress = progressResults[0].total_progress;

    // Ustal status na podstawie porównania total_progress z total_duration
    let status = 'Nowy';
    let completionDate = null; // Data ukończenia kursu
    if (totalProgress > 0) {
      status = 'W trakcie';
    }
    if (totalProgress >= totalDuration - 60) { // Uwzględnij margines błędu 60 sekund
      status = 'Ukończony';
      const currentDate = new Date();
      completionDate = currentDate.toISOString().split('T')[0]; // Zapisz tylko datę, bez godziny
    }

    // Zaktualizuj status kursu oraz, opcjonalnie, datę ukończenia dla użytkownika
    const updateQuery = `UPDATE user_courses SET status = ?, completion_date = ? WHERE user_id = ? AND course_id = ?`;
    await pool.query(updateQuery, [status, completionDate, userId, courseId]);

    console.log(`Course status for user ${userId} in course ${courseId} updated to ${status} with completion date ${completionDate}`);
  } catch (error) {
    console.error('Error updating course status:', error);
    throw error;
  }
};



// Aktualizacja statusu kursu
const updateUserCourseStatus = async (userId, courseId) => {
  try {
    // Oblicz łączną długość trwania wszystkich lekcji kursu
    const durationQuery = `SELECT SUM(duration) AS totalDuration FROM lessons WHERE course_id = ?`;
    const [durationResult] = await pool.query(durationQuery, [courseId]);
    const totalDuration = durationResult[0].totalDuration;

    // Oblicz łączny postęp użytkownika we wszystkich lekcjach kursu
    const progressQuery = `SELECT SUM(progress) AS totalProgress FROM user_lessons_progress
                           JOIN lessons ON user_lessons_progress.lesson_id = lessons.lesson_id
                           WHERE lessons.course_id = ? AND user_lessons_progress.user_id = ?`;
    const [progressResult] = await pool.query(progressQuery, [courseId, userId]);
    const totalProgress = progressResult[0].totalProgress;

    // Ustal status kursu na podstawie postępu
    let status = 'Nowy';
    if (totalProgress > 0) {
      status = 'W trakcie';
    }
    if (totalDuration <= totalProgress) {
      status = 'Ukończony';
    }

    // Aktualizuj status kursu w user_courses
    const updateQuery = `UPDATE user_courses SET status = ? WHERE user_id = ? AND course_id = ?`;
    await pool.query(updateQuery, [status, userId, courseId]);
    console.log('Status kursu zaktualizowany:', status);

  } catch (error) {
    console.error('Error updating course status:', error);
    throw error;
  }
};









module.exports = {
  saveUserCourseProgress,
  updateUserCourseStatus,
  getUserCourseProgress,
  saveUserCourseProgress,
  updateUserCourseStatus,
  getUserCourseProgress,
  updateLessonProgress,
  saveLessonProgress,
  getUserLessonProgress,
  calculateTotalCourseProgress,
  updateTotalProgressInCourse,
  getCourseInternalId,
  updateCourseStatusForUser
};
