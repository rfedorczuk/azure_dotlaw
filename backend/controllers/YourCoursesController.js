const pool = require('../config/db');

class YourCoursesController {
    async getCoursesByUserId(req, res) {
        try {
            const userId = req.params.userId;
            const [courses, fields] = await pool.query(
                'SELECT c.*, uc.enrollment_date, uc.status, uc.completion_date FROM courses c JOIN user_courses uc ON c.course_id = uc.course_id WHERE uc.user_id = ?',
                [userId]
            );
            
            // Dodanie liczby kursów
            const courseCount = courses.length;

            res.json({
                courseCount: courseCount,  // Liczba kursów
                courses: courses           // Lista kursów
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

 async getUsersByCompany(req, res) {
        try {
          const companyId = req.params.companyId;
          const [users, fields] = await pool.query(
            `SELECT u.id, u.email, u.name, u.surname, u.company_id, u.created_at, u.avatar, COUNT(uc.course_id) AS courseCount
             FROM users u
             LEFT JOIN user_courses uc ON u.id = uc.user_id
             WHERE u.company_id = ?
             GROUP BY u.id`,
            [companyId]
          );
      
          // Konwersja BLOB na format przyjazny dla przeglądarki
          users.forEach(user => {
            if (user.avatar) {
              user.avatar = Buffer.from(user.avatar).toString('base64');
            }
          });
      
          const usersCount = users.length;
      
          res.json({
            usersCount: usersCount,  // Liczba użytkowników
            users: users            // Lista użytkowników z avatarem w Base64 i liczbą kursów
          });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      };

    async getCoursesByCompany(req, res) {
      try {
          const companyId = req.params.companyId;
  
          // Zapytanie o kursy
         

// SELECT 
// c.id, 
// c.title, 
// c.description, 
// c.price,
// c.created_at,
// (SELECT COUNT(*) FROM company_courses WHERE company_id = cc.company_id) as TotalCourses
// FROM courses c
// JOIN company_courses cc ON c.id = cc.course_id
// WHERE cc.company_id = ?
// GROUP BY c.id, c.title, c.description, c.price, c.created_at;
         const queryCourses = `
          SELECT 
          c.id, 
          c.course_id,
          c.title, 
          c.description, 
          c.price,
          c.created_at,
          (SELECT COUNT(*) FROM company_courses WHERE company_id = cc.company_id) as TotalCourses,
          (
              SELECT COUNT(DISTINCT uc.user_id)
              FROM user_courses uc
              WHERE uc.course_id = c.course_id AND uc.company_id = cc.company_id
          ) as TotalUsers
      FROM courses c
      JOIN company_courses cc ON c.id = cc.course_id
      WHERE cc.company_id = ?
      GROUP BY c.id, c.title, c.description, c.price, c.created_at;
          `;
          const [courses] = await pool.query(queryCourses, [companyId]);
  
          // Zapytanie o ilość użytkowników
        //  const queryUsers = `SELECT COUNT(*) as UserCount FROM users WHERE company_id = ?`;
        //  const [[{ UserCount }]] = await pool.query(queryUsers, [companyId]);
  
          res.json({
              companyId: companyId,
              courses: courses,
              totalCourses: courses.length > 0 ? courses[0].TotalCourses : 0,
            //  totalUsers: UserCount
          });
      } catch (error) {
          console.error('Error fetching data for company:', error);
          res.status(500).json({ error: error.message });
      }
  };
  
    //   async getCoursesByCompany(req, res) {
    //     try {
    //         const companyId = req.params.companyId;
    //         const query = `
    //             SELECT 
    //                 c.id, 
    //                 c.title, 
    //                 c.description, 
    //                 c.price,
    //                 c.created_at,
    //                 (SELECT COUNT(*) FROM company_courses WHERE company_id = cc.company_id) as TotalCourses
    //             FROM courses c
    //             JOIN company_courses cc ON c.id = cc.course_id
    //             WHERE cc.company_id = ?
    //             GROUP BY c.id, c.title, c.description, c.price, c.created_at;
    //         `;
    
    //         const [courses] = await pool.query(query, [companyId]);
    
    //         res.json({
    //             companyId: companyId,
    //             courses: courses,
    //             totalCourses: courses.length > 0 ? courses[0].TotalCourses : 0
    //         });
    //     } catch (error) {
    //         console.error('Error fetching courses for company:', error);
    //         res.status(500).json({ error: error.message });
    //     }
    // };
    

      
      async updateCourseProgress (req, res) {
        const { userId, courseId, progress } = req.body;
    
        // Validate input
        if (!userId || !courseId || progress == null) {
            return res.status(400).send("Invalid request parameters");
        }
    
        try {
            const updatedProgress = await Course.updateUserCourseProgress(userId, courseId, progress);
            res.send({ message: "Progress updated successfully", updatedProgress });
        } catch (error) {
            res.status(500).send("Error updating course progress: " + error.message);
        }
    };
    
      
    // Metody do tworzenia, aktualizacji, usuwania kursów...
}

module.exports = new YourCoursesController();
