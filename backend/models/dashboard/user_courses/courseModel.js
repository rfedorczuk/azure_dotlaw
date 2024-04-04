// courseModel.js
const pool = require('../../../config/db');
const checkAvailableSlots = require('../user_courses/courseAvailableSlotModel');

const courseModel = {

  assignCourseToUser: async (userId, code) => {
    console.log('Przypisywanie', userId, code);
    const courseQuery = `SELECT c.course_id AS actualCourseId FROM courses c 
    INNER JOIN course_codes cc ON c.course_id = cc.course_id 
    WHERE cc.code = ?
    AND (cc.valid_until IS NULL OR cc.valid_until > NOW())`;
    const [courses] = await pool.execute(courseQuery, [code]);
    
    if (courses.length === 0) {
        throw new Error('Nie znaleziono kursu dla podanego kodu, lub kod jest przeterminowany lub już wykorzystany.');
    }
  
    const actualCourseId = courses[0].actualCourseId;
  
    // Sprawdzanie dostępnych slotów
    const availableSlots = await checkAvailableSlots.checkAvailableSlots(actualCourseId);
    if (availableSlots <= 0) {
        throw new Error('Brak dostępnych miejsc na ten kurs.');
    }
  
    const assignQuery = `INSERT INTO user_courses (user_id, course_id, status) VALUES (?, ?, 'Nowy')`;
    const [assignResult] = await pool.execute(assignQuery, [userId, actualCourseId]);
    
    return assignResult;
},


assignMultipleUsersToCourse: async (userIds, courseId, companyId) => {
  try {
      // Używanie funkcji checkAvailableSlots z modelu
      const availableSlots = await checkAvailableSlots.checkAvailableSlots(courseId);
      if (availableSlots < userIds.length) {
          throw new Error(`Dostępne tylko ${availableSlots} miejsca, ale podano ${userIds.length} użytkowników.`);
      }

      const values = userIds.map(userId => [userId, courseId, 'Nowy', companyId]);
      const query = `INSERT INTO user_courses (user_id, course_id, status, company_id) VALUES ?`;

      await pool.query(query, [values]);
      return {
          message: "Użytkownicy zostali pomyślnie przypisani do kursu.",
          assignedCount: userIds.length,
          notAssignedCount: 0 // W tym przypadku wszyscy użytkownicy zostali przypisani
      };
  } catch (error) {
      console.error('Błąd podczas przypisywania użytkowników do kursu:', error);
      throw error; // Ponowne zgłoszenie wyjątku do obsługi na wyższym poziomie
  }
},


// Dodaj tę funkcję do courseModel.js
addCourseCode: async (courseId, code, validUntil = null) => {
  const query = `INSERT INTO course_codes (course_id, code, valid_until) VALUES (?, ?, ?)`;
  const [result] = await pool.execute(query, [courseId, code, validUntil]);
  return result;
},


saveCertificateBlob: async (userId, courseId, certificateBlob) => {
  console.log('saveCertificateBlob ', userId, courseId);
  const query = `UPDATE user_courses SET certificate_blob = ? WHERE user_id = ? AND course_id = ?`;
  const [result] = await pool.execute(query, [certificateBlob, userId, courseId]);
  return result;
},

getCertificateBlob: async (userId, courseId) => {
  console.log('getCertificateBlob ', userId, courseId);
  const query = `SELECT certificate_blob FROM user_courses WHERE user_id = ? AND course_id = ?`;
  const [rows] = await pool.execute(query, [userId, courseId]);
  return rows.length ? rows[0].certificate_blob : null;
},

// courseModel.js
getAllCertificates: async (companyId) => {
  const query = `
    SELECT uc.user_id, uc.course_id, uc.certificate_blob 
    FROM user_courses uc
    JOIN users u ON uc.user_id = u.id
    WHERE uc.certificate_blob IS NOT NULL AND u.company_id = ?`;
  const [rows] = await pool.execute(query, [companyId]);
  return rows;
},


// Add to courseModel.js
getCertificatesForUser: async (userId) => {
  const query = `SELECT 
  c.title AS name, 
  uc.enrollment_date AS purchaseDate, 
  uc.course_id AS courseId,
  uc.certificate_blob AS pdf 
FROM 
  user_courses uc 
JOIN 
  courses c ON uc.course_id = c.course_id
WHERE 
  uc.user_id = 34 
  AND uc.status = 'Ukończony'
  AND uc.certificate_blob IS NOT NULL
`;

  const [rows] = await pool.execute(query, [userId]);

  // Correctly reference row.courseId inside the map function
  return rows.map(row => ({
    ...row,
    // Use row.courseId to dynamically create the endpoint URL
    pdf: `/api/certificates/download-certificate/${userId}/${row.courseId}` // Correct usage of row.courseId
  }));
},



getCompletedUserCoursesWithCertificates: async (userId) => {
  const query = `
  SELECT COUNT(*) as completed_courses_count
FROM user_courses
WHERE status = 'Ukończony' AND user_id = ?;
  `;

  try {
      const [results] = await pool.query(query, [userId]);
      return results;
  } catch (err) {
      console.error('Error executing getCompletedUserCoursesWithCertificates query', err);
      throw err;
  }
},

getCompletedCoursesWithCertificates: async (companyId) => {
  const query = `
  SELECT 
  uc.course_id,
  COUNT(DISTINCT uc.user_id) AS UsersCompleted,
  COUNT(DISTINCT CASE WHEN uc.certificate_blob IS NOT NULL THEN uc.user_id ELSE NULL END) AS CertificatesAwarded
FROM user_courses uc
WHERE uc.status = 'Ukończony'
AND uc.company_id = ?
GROUP BY uc.course_id;
  `;

  try {
      const [results] = await pool.query(query, [companyId]);
      return results;
  } catch (err) {
      console.error('Error executing getCompletedCoursesWithCertificates query', err);
      throw err;
  }
},





  validateCourseCode: async (code) => {
  console.log('validateCourseCode ',code);
    const query = `SELECT * FROM course_codes WHERE code = ? AND is_used = 0 AND (valid_until IS NULL OR valid_until > NOW())`;
    const [rows] = await pool.execute(query, [code]);
    return rows.length ? rows[0] : null;
  },

  // markCodeAsUsed: async (codeId, userId) => {
  // console.log('markCodeAsUsed ',codeId, userId);
  //   const query = `UPDATE course_codes SET is_used = 1, used_by_user_id = ? WHERE code_id = ?`;
  //   const [result] = await pool.execute(query, [userId, codeId]);
  //   return result;
  // }
};

module.exports = courseModel;
