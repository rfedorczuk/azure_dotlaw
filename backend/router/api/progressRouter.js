const express = require('express');
const router = express.Router();
const progressController = require('../../controllers/ProgressController');
const authMiddleware = require('../../middlewares/isAuthenticated'); 

router.get('/get-progress/:userId/:courseId/:lessonId',authMiddleware, progressController.getProgress);
router.post('/save-progress',authMiddleware, progressController.saveProgress);
// Usunięto router.post('/update-course-status', progressController.updateCourseStatus);
//router.post('/save-lesson-progress', progressController.saveProgress); // Zapisz postęp lekcji


module.exports = router;