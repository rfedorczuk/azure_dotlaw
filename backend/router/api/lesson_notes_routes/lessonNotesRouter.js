// router.js

const router = require('express').Router();
const notesController = require('../../../controllers/lessons-controllers/notesController');
const authMiddleware = require('../../../middlewares/isAuthenticated'); 

router.post('/notes',authMiddleware, notesController.createNote);
router.get('/notes/:userId/:courseId',authMiddleware, notesController.getNotes);


module.exports = router;
