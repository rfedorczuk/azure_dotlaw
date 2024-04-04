const router = require('express').Router();
const CourseController = require('../../controllers/CourseController');
const courseCodeController = require('../../controllers/course-controllers/courseCodeController')
const UsersController = require('../../controllers/UsersController');
const YourCoursesController = require('../../controllers/YourCoursesController');
const authMiddleware = require('../../middlewares/isAuthenticated'); 
//router.get('/user/:userId/courses', CourseController.getUserCourses);


router.get('/user/:userId/courses',authMiddleware, YourCoursesController.getCoursesByUserId);
router.get('/company/:companyId',authMiddleware, YourCoursesController.getUsersByCompany);
router.get('/company/get/:companyId',authMiddleware, YourCoursesController.getCoursesByCompany);
router.get('/:courseId/duration', CourseController.getCourseDuration);
router.get('/get-all-courses',authMiddleware, CourseController.getAllCourses);
router.get('/company/completed-courses/:companyId',authMiddleware, CourseController.completedCourses);
router.get('/user/completed-courses/:userId',authMiddleware, CourseController.completedUserCourses);

router.post('/enroll',authMiddleware, CourseController.enrollUserInCourse);
router.post('/addCourse',authMiddleware, CourseController.enrollUserInCourse);
router.post('/assign-users-to-course',authMiddleware, CourseController.assignUsersToCourse);
router.post('/generate-course-code',authMiddleware, courseCodeController.generateCourseCode);
  
//router.put('/progress', CourseController.updateCourseProgress);
router.get('/get/companies',authMiddleware, CourseController.getAllCompanies);
router.post('/assign-companies',authMiddleware, CourseController.assignCompaniesToCourse);

router.get('/user/:userId/course/:courseId/enrolled',authMiddleware, UsersController.checkIfUserEnrolled);

router.put('/:courseId/set-user-limit',authMiddleware, CourseController.setUserLimit);

module.exports = router;
/*
const router = require('express').Router();
const CourseController = require('../../controllers/CourseController');
const courseCodeController = require('../../controllers/course-controllers/courseCodeController')
const UsersController = require('../../controllers/UsersController');
const YourCoursesController = require('../../controllers/YourCoursesController');

//router.get('/user/:userId/courses', CourseController.getUserCourses);


router.get('/user/:userId/courses', YourCoursesController.getCoursesByUserId);
router.get('/company/:companyId', YourCoursesController.getUsersByCompany);
router.get('/company/get/:companyId', YourCoursesController.getCoursesByCompany);
router.get('/:courseId/duration', CourseController.getCourseDuration);

router.post('/enroll', CourseController.enrollUserInCourse);
router.post('/addCourse', courseCodeController.addCourseByCode);
//router.put('/progress', CourseController.updateCourseProgress);


router.get('/user/:userId/course/:courseId/enrolled', UsersController.checkIfUserEnrolled);



module.exports = router;
*/