const express = require('express');
const VimeoController = require('../../controllers/VimeoController');
const router = express.Router();
const authMiddleware = require('../../middlewares/isAuthenticated'); 

router.get('/courses/save-courses', async (req, res) => {
    try {
        const savedCourses = await VimeoController.saveCoursesToDatabase();
        res.status(200).json({
            message: 'Courses successfully saved to database',
            data: savedCourses
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get('/courses', VimeoController.getCourses);
router.get('/courses/:courseId', VimeoController.getCourseDetails);


module.exports = router;
