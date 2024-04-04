// existing requires
const router = require('express').Router();
const questionController = require('../../controllers/QuestionController');
const authMiddleware = require('../../middlewares/isAuthenticated'); 

// existing GET routes
router.get('/all/courses',authMiddleware, questionController.getAllCourses);
router.get('/questions/:courseId',authMiddleware, questionController.getQuestions);
router.get('/answers/:questionId',authMiddleware, questionController.getAnswers);

// POST route to create a new question
router.post('/questions',authMiddleware, questionController.createQuestion);

// POST route to create a new answer
router.post('/answers',authMiddleware, questionController.createAnswer);

module.exports = router;
