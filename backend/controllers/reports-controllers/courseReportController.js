const ExcelJS = require('exceljs');
const pool = require('../../config/db.js');

exports.exportReportsToExcel = async (req, res) => {
  const courseId = req.params.courseId;

  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Raport szkolenia');

    worksheet.columns = [
      { header: 'Nazwa szkolenia', key: 'title', width: 30 },
      { header: 'Egzamin', key: 'has_exam', width: 10 },
      { header: 'Ilość użytkowników', key: 'user_count', width: 20 },
      { header: 'Data dodania', key: 'created_at', width: 20 },
      { header: 'Kod kursu', key: 'course_code', width: 15 },
    ];

    // Tutaj wykonujemy zapytanie do bazy danych
    const [courses] = await pool.query(`
    SELECT 
    c.id,
    c.course_id, 
    c.title,
    c.created_at, 
    cc.code AS course_code, -- Course code from the course_codes table
    COUNT(DISTINCT uc.user_id) as user_count, -- Count of distinct users enrolled in the course
    (SELECT COUNT(DISTINCT id) FROM users) as total_user_count, -- Total count of users
    CASE 
        WHEN EXISTS (SELECT 1 FROM questions q WHERE q.course_id = c.course_id) THEN 'TAK'
        ELSE 'NIE'
    END AS has_exam -- Checks if the course has an exam based on the questions table
FROM 
    courses c
LEFT JOIN 
    user_courses uc ON c.course_id = uc.course_id -- Left join to include all courses
LEFT JOIN 
    course_codes cc ON c.course_id = cc.course_id -- Left join to include the course code
WHERE 
    c.id = ? -- Filtruje kursy na podstawie przekazanego courseId
GROUP BY 
    c.course_id, c.title, c.created_at, cc.code;
`, [courseId]);

    courses.forEach(course => {
      course.has_exam = course.has_exam ? 'TAK' : 'NIE';
      worksheet.addRow(course);
    });

    worksheet.getRow(1).font = { bold: true };

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="report-course-${courseId}.xlsx"`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error exporting courses to Excel:', error);
    res.status(500).send('Error exporting courses to Excel');
  }
};
