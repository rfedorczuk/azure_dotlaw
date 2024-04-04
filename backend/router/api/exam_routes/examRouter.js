// router.js

const router = require('express').Router();
const pool = require('../../../config/db'); 
const authMiddleware = require('../../../middlewares/isAuthenticated'); 


router.post('/courses/:courseId/questions',authMiddleware, async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const { questionText } = req.body;

        const [result] = await pool.execute(
            'INSERT INTO questions (course_id, question_text) VALUES (?, ?)',
            [courseId, questionText]
        );

        res.status(201).json({ questionId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/questions/:questionId/answers',authMiddleware, async (req, res) => {
    try {
        const questionId = req.params.questionId;
        const { answerText, isCorrect } = req.body;

        const [result] = await pool.execute(
            'INSERT INTO answers (question_id, answer_text, is_correct) VALUES (?, ?, ?)',
            [questionId, answerText, isCorrect ? 1 : 0]
        );

        res.status(201).json({ answerId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Aktualizacja pytania
router.put('/questions/:questionId',authMiddleware, async (req, res) => {
    try {
        const { questionText } = req.body;
        await pool.execute(
            'UPDATE questions SET question_text = ? WHERE id = ?',
            [questionText, req.params.questionId]
        );
        res.json({ message: 'Pytanie zostało zaktualizowane.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Aktualizacja odpowiedzi
router.put('/answers/:answerId',authMiddleware, async (req, res) => {
    try {
        const { answerText, isCorrect } = req.body;
        await pool.execute(
            'UPDATE answers SET answer_text = ?, is_correct = ? WHERE id = ?',
            [answerText, isCorrect ? 1 : 0, req.params.answerId]
        );
        res.json({ message: 'Odpowiedź została zaktualizowana.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/courses/:courseId/exam',authMiddleware, async (req, res) => {
    try {
        const courseId = req.params.courseId;
        console.log('courseId: ',courseId);

        const [questions] = await pool.execute(
            'SELECT * FROM questions WHERE course_id = ?',
            [courseId]
        );

        const questionsWithAnswers = await Promise.all(
            questions.map(async (question) => {
                const [answers] = await pool.execute(
                    'SELECT * FROM answers WHERE question_id = ?',
                    [question.id]
                );
                return { ...question, answers };
            })
        );

        res.json(questionsWithAnswers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/questions/:questionId',authMiddleware, async (req, res) => {
    const questionId = req.params.questionId;

    try {
        // Najpierw usuwamy wszystkie odpowiedzi dla pytania
        await pool.execute('DELETE FROM answers WHERE question_id = ?', [questionId]);

        // Następnie usuwamy samo pytanie
        await pool.execute('DELETE FROM questions WHERE id = ?', [questionId]);

        res.status(200).json({ message: 'Pytanie i wszystkie powiązane odpowiedzi zostały usunięte.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
