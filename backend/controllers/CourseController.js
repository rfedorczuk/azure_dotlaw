const Course = require('../models/website/course');
const CourseModel = require('../models/dashboard/user_courses/courseModel')
const pool = require('../config/db');

exports.assignUsersToCourse = async (req, res) => {
  try {
  console.log(JSON.stringify(req.body));
    const { courseId, userIds, companyId } = req.body; // ID kursu i ID użytkowników przekazane w ciele żądania
    // Przykład, jak można pobrać companyId, zakładając, że jest dostępne w req.user
    //const companyId = req.user.companyId;

    // Użycie zaktualizowanej funkcji z modelu
    await CourseModel.assignMultipleUsersToCourse(userIds, courseId, companyId);

    res.json({ message: "Users successfully assigned to course." });
  } catch (error) {
    console.error('Error in assigning users to course:', error);
    res.status(500).json({ message: "Failed to assign users to course.", error: error.message });
  }
};
  
exports.enrollUserInCourse = async (req, res) => {
    const { userId, courseId } = req.body;
    console.log('enrollUserInCourse ',req.body)

    try {
        const enrollment = await Course.enrollUser(userId, courseId);
        res.json(enrollment);
    } catch (error) {
        res.status(500).send("Error enrolling in course: " + error.message);
    }
};

exports.completedCourses = async (req, res) => {
    const { companyId } = req.params; // Pobieranie companyId z parametrów URL

    try {
        const data = await CourseModel.getCompletedCoursesWithCertificates(companyId);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "An error occurred while fetching completed courses."
        });
    }
};

exports.completedUserCourses = async (req, res) => {
    const { userId } = req.params; // Pobieranie companyId z parametrów URL

    try {
        const data = await CourseModel.getCompletedUserCoursesWithCertificates(userId);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "An error occurred while fetching completed courses."
        });
    }
};


exports.getAllPublicCourses = async (req, res) => {
    try {
        const publicCourses = await Course.findAllPublicCourses();
        res.json({ success: true, courses: publicCourses });
    } catch (error) {
        console.error('Error retrieving public courses:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

exports.getUserCourses = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log('userId ', userId);
        const courses = await Course.getUserCourses(userId); // Dodano await
        console.log(JSON.stringify(courses));
        res.json(courses);
    } catch (error) {
        res.status(500).send("Error retrieving user courses: " + error.message);
    }
};

exports.getCourseDuration = async (req, res) => {
    const courseId = req.params.courseId;
    try {
        const duration = await Course.getFormattedDuration(courseId);
        if (duration) {
            res.json({ success: true, duration: duration });
        } else {
            res.status(404).send({ success: false, message: 'Course not found' });
        }
    } catch (error) {
        console.error('Error getting course duration:', error);
        res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
};

exports.getAllCourses = async (req, res, next) => {
        try {
            const courses = await Course.getAllCourses();
            res.status(200).json(courses);
        } catch (error) {
            console.error('Error fetching all courses:', error);
            res.status(500).send({ message: error.message });
        }
    };


exports.getAllCompanies = async (req, res) => {
  const { courseId } = req.query;
  console.log('Received courseId:', courseId); // Loguje otrzymane courseId

  try {
    let query = `
      SELECT companies.id, companies.company_name, companies.created_at,
      COUNT(company_courses.course_id) > 0 AS hasCourse
      FROM companies
      LEFT JOIN company_courses ON companies.id = company_courses.company_id
    `;
    let queryParams = [];

    if (courseId) {
      query += ` AND company_courses.course_id = ?`;
      queryParams.push(courseId);
      console.log('Adding courseId to query:', courseId); // Loguje dodanie courseId do zapytania
    }

    query += ` GROUP BY companies.id, companies.company_name, companies.created_at`;

    console.log('Executing query:', query); // Loguje wykonanie zapytania
    console.log('With parameters:', queryParams); // Loguje parametry zapytania

    const [companies] = await pool.query(query, queryParams);
    
    console.log('Query result:', companies); // Loguje wynik zapytania

    const modifiedCompanies = companies.map(company => ({
      ...company,
      hasCourse: !!company.hasCourse // Zamienia liczbę na wartość boolean
    }));

    console.log('Modified companies:', modifiedCompanies); // Loguje zmodyfikowane dane firm

    res.json(modifiedCompanies);
  } catch (error) {
    console.error('Error in getAllCompanies:', error); // Loguje błąd
    res.status(500).send('Server error');
  }
};


exports.assignCompaniesToCourse = async (req, res) => {
  const { courseId, companyIds } = req.body;
  try {
    const promises = companyIds.map(companyId => 
      pool.query('INSERT INTO company_courses (company_id, course_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE course_id = course_id', [companyId, courseId])
    );
    await Promise.all(promises);
    res.json({ message: 'Companies assigned to course successfully' });
  } catch (error) {
    console.error('Error assigning companies to course:', error);
    res.status(500).send('Error assigning companies to course');
  }
};


exports.setUserLimit = async (req, res) => {
  const { courseId } = req.params;
  const { userLimit } = req.body;

  if (!courseId || !userLimit) {
    return res.status(400).json({ message: 'Brakujące courseId lub userLimit.' });
  }

  try {
    const query = 'UPDATE courses SET user_limit = ? WHERE id = ?';
    const [result] = await pool.execute(query, [userLimit, courseId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Kurs nie znaleziony.' });
    }

    res.json({ message: 'Limit użytkowników został zaktualizowany.', courseId, userLimit });
  } catch (error) {
    console.error('Błąd przy ustawianiu limitu użytkowników dla kursu:', error);
    res.status(500).json({ message: 'Błąd serwera.' });
  }
};







