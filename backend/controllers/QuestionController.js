const Question = require('../models/dashboard/QuestionModel');

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Question.getCourses();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message || "Some error occurred while retrieving courses." });
  }
};

exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.getQuestionsByCourseId(req.params.courseId);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message || "Some error occurred while retrieving questions." });
  }
};

exports.getAnswers = async (req, res) => {
  try {
    const answers = await Question.getAnswersByQuestionId(req.params.questionId);
    res.json(answers);
  } catch (error) {
    res.status(500).json({ message: error.message || "Some error occurred while retrieving answers." });
  }
};

exports.createQuestion = async (req, res) => {
    console.log('body ',JSON.stringify(req.body))
  try {
    const newQuestion = req.body;
    const createdQuestion = await Question.createQuestion(newQuestion);
    res.status(201).json(createdQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message || "Some error occurred while creating the question." });
  }
};

exports.createAnswer = async (req, res) => {
  try {
    const newAnswer = req.body;
    const createdAnswer = await Question.createAnswer(newAnswer);
    res.status(201).json(createdAnswer);
  } catch (error) {
    res.status(500).json({ message: error.message || "Some error occurred while creating the answer." });
  }
};
