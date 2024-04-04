// controllers/courseController.js
const courseModel = require('../../models/admin-dashboard/adminCoursesModel');

const getCoursesWithCount = async (req, res) => {
    try {
        const courses = await courseModel.getCoursesWithCount();
        res.json(courses);
    } catch (error) {
        res.status(500).send('Error while fetching courses count');
    }
};

module.exports = {
    getCoursesWithCount
};
