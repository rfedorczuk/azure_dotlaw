const db = require('../../config/db');

const Question = {
  getCourses: async () => {
    try {
      const [rows, fields] = await db.query("SELECT * FROM courses");
      return rows;
    } catch (error) {
      throw error;
    }
  },

  getQuestionsByCourseId: async (courseId) => {
    try {
      const [rows, fields] = await db.query("SELECT * FROM questions WHERE course_id=?", [courseId]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  getAnswersByQuestionId: async (questionId) => {
    try {
      const [rows, fields] = await db.query("SELECT * FROM answers WHERE question_id=?", [questionId]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  createQuestion: async (newQuestion) => {
    try {
      const [results, fields] = await db.query("INSERT INTO questions SET ?", newQuestion);
      return results;
    } catch (error) {
      throw error;
    }
  },

  createAnswer: async (newAnswer) => {
    try {
      const [results, fields] = await db.query("INSERT INTO answers SET ?", newAnswer);
      return results;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Question;
