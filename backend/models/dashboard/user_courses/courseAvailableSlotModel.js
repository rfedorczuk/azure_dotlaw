const pool = require('../../../config/db');

  const CourseAvalibleSlotModel = {
      checkAvailableSlots: async (courseId) => {
          const slotsQuery = `SELECT user_limit - (SELECT COUNT(*) FROM user_courses WHERE course_id = ?) AS availableSlots FROM courses WHERE course_id = ?`;
          const [slots] = await pool.execute(slotsQuery, [courseId, courseId]);
  
          if (slots.length > 0 && slots[0].availableSlots !== null) {
              return slots[0].availableSlots;
          } else {
              throw new Error('Course not found or limit not set.');
          }
      }
  };
  
  module.exports = CourseAvalibleSlotModel;