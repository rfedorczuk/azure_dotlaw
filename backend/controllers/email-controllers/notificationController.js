// notificationController.js
const transporter = require('../../config/mail'); // Make sure this points to your mail configuration
const UsersController = require('../../controllers/UsersController');
const Course = require('../../models/website/course'); // Update the path according to your structure

const sendReminder = async (req, res) => {
  const { userId, courseId, type, userEmail } = req.body;

  try {
    const user = await UsersController.findById(userId);
    const course = await Course.findByCourseId(courseId);

    if (!user || !course) {
      return res.status(404).json({message: 'User or course not found.'});
    }

    let subject = '';
    let html = '';

    if (type === 'start') {
      subject = 'Przypomnienie o rozpoczęciu kursu';
      html = `<p>Cześć, <strong>${user.name} ${user.surname}</strong><br><br>Manager Twojej organizacji przypomina Ci o rozpoczęciu kursu <strong>${course.title}</strong>.</p>`;
    } else if (type === 'finish') {
      subject = 'Przypomnienie o dokończeniu kursu';
      html = `<p>Cześć, <strong>${user.name} ${user.surname}</strong><br><br>Manager Twojej organizacji przypomina Ci o dokończeniu kursu <strong>${course.title}</strong>.</p>`;
    }

    const mailOptions = {
      from: 'no-reply-tester@test.pl',
      to: userEmail, // Use the email passed from the frontend
      subject,
      html, // Use HTML content
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({message: 'Nie udało się wysłać e-maila.'});
      }
      console.log('Email sent: ' + info.response);
      res.status(200).json({message: 'E-mail z przypomnieniem został wysłany.'});
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({message: 'Wewnętrzny błąd serwera.'});
  }
};

module.exports = {
  sendReminder
};
