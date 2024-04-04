// controllers/progressController.js

const progressModel = require('../models/dashboard/Progress');
const pool = require('../config/db')

const saveProgress = async (req, res) => {
  try {
    const { userId, courseId: courseExternalId, lessonId, progress } = req.body;
    // Pobierz wewnętrzne ID kursu na podstawie zewnętrznego ID
    const courseId = await progressModel.getCourseInternalId(courseExternalId);
    console.log('courseId saveProgress ',courseId)

    if (!courseId) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Zapisz postęp lekcji
    await progressModel.saveLessonProgress(userId, courseId, lessonId, progress);

    // Automatycznie oblicza i aktualizuje całkowity postęp kursu dla użytkownika
    await progressModel.updateTotalProgressInCourse(userId, courseId);

    // Opcjonalnie, aktualizuje status kursu na podstawie postępu
    await progressModel.updateCourseStatusForUser(userId, courseId);

    res.json({ message: 'Progress saved successfully' });
  } catch (error) {
    console.error('Error saving progress:', error);
    res.status(500).send(error.message);
  }
};



// const updateCourseStatus = async (req, res) => {
//   try {
//     const { userId, courseId } = req.body;
//     console.log('updateCourseStatus ', JSON.stringify(req.body));

//     const progress = await progressModel.getUserCourseProgress(userId, courseId); // Dodano await
//     if (progress === null) {
//       return res.status(404).json({ message: 'No progress found for this user and course.' });
//     }
//     console.log('progress ', progress);

//     let status = 'Nowy';
//     if (progress > 0.00 && progress < 10000.00) {
//       status = 'W trakcie';
//     } else if (progress >= 10000.00) {
//       status = 'Ukończony';
//     }

//     await progressModel.updateUserCourseStatus(userId, courseId, status); // Dodano await
//     res.json({ message: 'Course status updated successfully', status });
//   } catch (error) {
//     console.error('Error updating course status:', error);
//     res.status(500).send(error.message);
//   }
// };




// const getProgress = async (req, res) => {
//   try {
//     const { userId, courseId } = req.params;
//     console.log('req params', req.params);
    
//     const progressTime = await progressModel.getUserCourseProgress(userId, courseId);
//     console.log('progressTime', progressTime); // This should log after the promise resolves

//     res.json({ progressTime });
//   } catch (error) {
//     console.error('Error in getProgress:', error); // Log any caught errors
//     res.status(500).send(error.message);
//   }
// };

const getProgress = async (req, res) => {
  try {
    const { userId, courseId, lessonId } = req.params;
    // Teraz pobieramy postęp dla konkretnej lekcji dla danego użytkownika
    const query = 'SELECT progress FROM user_lessons_progress WHERE user_id = ? AND lesson_id = ? LIMIT 1';
    const [results] = await pool.query(query, [userId, lessonId]);

    if (results.length === 0) {
      // Jeśli nie znaleziono postępu, zwracamy 0 jako domyślny postęp
      return res.json({ progress: 0 });
    }

    const progress = results[0].progress;
    console.log('Lesson progress for user', userId, 'on lesson', lessonId, ':', progress);
    res.json({ progress });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).send('Internal Server Error');
  }
};



module.exports = {
  saveProgress,
  getProgress
};
