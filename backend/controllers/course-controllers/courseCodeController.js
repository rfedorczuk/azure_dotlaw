// courseController.js
const courseModel = require('../../models/dashboard/user_courses/courseModel');

const courseController = {
  // Dodaje kurs do użytkownika na podstawie podanego kodu
  addCourseByCode: async (req, res) => {
    const { courseCode, userId } = req.body;
    try {
      // Bezpośrednie przypisanie kursu do użytkownika za pomocą kodu kursu
      const result = await courseModel.assignCourseToUser(userId, courseCode);
      res.send({ message: 'Course added successfully.', result });
    } catch (error) {
      console.error('Error adding course:', error);
      res.status(500).send({ message: 'Error adding course. ' + error.message });
    }
  },

  // Generuje nowy kod dla kursu i dodaje go do bazy danych
  generateCourseCode: async (req, res) => {
    console.log(JSON.stringify(req.body))
    const { courseId, validUntil } = req.body;
    // Generowanie 12-znakowego kodu składającego się z cyfr i liter
    const code = Math.random().toString(36).substring(2, 14).toUpperCase();
    try {
      const result = await courseModel.addCourseCode(courseId, code, validUntil);
      res.json({ message: 'Code generated successfully', code, result });
    } catch (error) {
      console.error('Error generating course code:', error);
      res.status(500).send({ message: 'Error generating course code. ' + error.message });
    }
  },

  // Możesz dodać tutaj kolejne metody kontrolera
};

module.exports = courseController;
