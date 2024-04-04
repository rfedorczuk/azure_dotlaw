// backend/server.js
require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const configPath = process.env.CONFIG_PATH || './config';
const pool = require(`${configPath}/db`);

const authRouter = require('./router/api/authRouter');
const userRouter = require('./router/api/userRouter');
const vimeoRouter = require('./router/api/vimeoRouter');
const transcationRouter = require('./router/api/transcationRouter');
const courseRouter = require('./router/api/courseRouter');
const examRouter = require('./router/api/exam_routes/examRouter');
const lessonNotesRouter = require('./router/api/lesson_notes_routes/lessonNotesRouter');
const adminCoursesRouter = require('./router/api/admin_routes/adminCoursesRouter');
const progressRouter = require('./router/api/progressRouter');
const emailInvitationsRouter = require('./router/api/email_routes/emailInvitationsRouter');
const discountCodeRouter = require('./router/api/codes_routes/discountRouter');
const stripeRouter = require('./router/api/payments_routes/stripeRoutes');
const certificateRoutes = require('./router/api/certificateRouter');
const companiesRoutes = require('./router/api/admin_routes/adminCompaniesRouter');
const adminCertificatesRoutes = require('./router/api/admin_routes/adminCertificatesRouter');
const emailContactRouter = require('./router/api/email_routes/emailContactRouter');
const emailNotificationRouter = require('./router/api/email_routes/emailNotificationRouter');
const courseReportsRouter = require('./router/api/reports_routes/courseReportsRouter');
const saleStatisticsRouter = require('./router/api/statistics_routes/salesStaticticsRouter');

const app = express();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200
  });
  
// app.use(limiter);
app.use(cookieParser());
app.use(helmet());

const corsOptions = {
    origin: ['https://akademia.dotlaw.co'], // Adresy Twoich aplikacji frontendowych
    credentials: true, // Pozwala na wysyłanie ciasteczek między domenami
  };
  
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Middleware obsługi błędów musi być dodane na końcu, po wszystkich innych middleware i trasach
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Coś poszło nie tak!');
});

// Używanie routera
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/your-course', progressRouter);
app.use('/api/lesson', lessonNotesRouter);
app.use('/api/vimeo', vimeoRouter);
app.use('/api/new', transcationRouter);
app.use('/api/course', courseRouter);
app.use('/api/exam', examRouter);
app.use('/api/invitation', emailInvitationsRouter);
app.use('/api/contact', emailContactRouter);
app.use('/api/admin', adminCoursesRouter);
app.use('/api/discount', discountCodeRouter);
app.use('/api/payments', stripeRouter);
app.use('/api/certificates', certificateRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/admin/certificates', adminCertificatesRoutes);
app.use('/api/notification', emailNotificationRouter);
app.use('/api/get/reports', courseReportsRouter);
app.use('/api/statistics', saleStatisticsRouter);

// Wyświetla aktualny katalog roboczy
console.log(`Aktualny katalog roboczy: ${process.cwd()}`);

// Konstruowanie i wyświetlanie oczekiwanej ścieżki do pliku db.js
const dbPath = path.resolve(__dirname, './config/db');
console.log(`Oczekiwana ścieżka do pliku db.js: ${dbPath}`);

app.get("/api", (req, res) => {
    res.json({ message: "API WORKS." });
});

app.get('/check-db-connection', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT 1 + 1 AS solution');
        connection.release(); // Pamiętaj, aby zawsze zwalniać połączenie po użyciu
        res.status(200).json({
            message: 'Połączenie z bazą danych zostało nawiązane pomyślnie.',
            solution: rows[0].solution
        });
    } catch (error) {
        res.status(500).json({
            message: 'Nie udało się nawiązać połączenia z bazą danych.',
            error: error.message
        });
    }
});

console.log('proccess port',process.env.PORT)
app.listen(process.env.PORT, () => {
    console.log(`Backend server is running on port ${process.env.PORT}`);
});
