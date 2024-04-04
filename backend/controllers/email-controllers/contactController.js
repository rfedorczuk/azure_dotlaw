const nodemailer = require('nodemailer');
const transporter = require('../../config/mail');

exports.sendEmail = async (req, res) => {
    let mailOptions = {
        from: `${req.body.email}`,
        to: 'no-reply-tester@crem.pl',
        subject: 'Wiadomość z formularza kontaktowego',
        html: `
          <meta charset="UTF-8">
          Wiadomość od: ${req.body.email}<br><br>
          Treść wiadomości: ${req.body.message}
        `, // Użyj pola `html` z deklaracją UTF-8
      };
      

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email', error);
        return res.status(500).send({ message: 'Error sending email', error: error.message });
      }
      console.log('Email sent: ' + info.response);
      res.send({ message: 'Email sent successfully', info: info.response });
    });
};

  