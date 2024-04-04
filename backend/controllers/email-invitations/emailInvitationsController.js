// controllers/emailInvitationsController.js
const nodemailer = require('nodemailer');
const transporter = require('../../config/mail');
const sql = require('../../config/db');

// Konfiguracja Nodemailer
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'twojemail@gmail.com',
//     pass: 'twojehaslo'
//   }
// });

exports.sendInvitations = async (req, res) => {
  const { emails, companyId } = req.body;

  if (!emails || emails.length === 0) {
    return res.status(400).send({ message: 'Brak adresów e-mail do wysłania.' });
  }

  // Pobierz nazwę firmy na podstawie companyId
  const query = 'SELECT company_name FROM companies WHERE id = ?';
  let companyName;
  try {
    const [rows] = await sql.query(query, [companyId]);
    if (rows.length > 0) {
      companyName = rows[0].company_name;
    } else {
      return res.status(404).send({ message: 'Firma nie znaleziona.' });
    }
  } catch (error) {
    console.error('Error querying company:', error);
    return res.status(500).send({ message: 'Błąd podczas wyszukiwania firmy.' });
  }

  // Wysyłanie zaproszeń z nazwą firmy
  emails.forEach(email => {
    const mailOptions = {
      from: 'no-reply-tester@crem.pl',
      to: email,
      subject: 'Zaproszenie do platformy dotlaw.co',
      html: `Twoja firma: ${companyName} zaprasza Cię do platformy dotlaw.co <br> <a href="https://akademia.dotlaw.co/signup">Twoje doświadczenie zaczyna się tutaj.</a>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).send({ message: 'Błąd podczas wysyłania zaproszenia.' });
      } else {
        console.log('Email wysłany: ' + info.response);
      }
    });
  });

  res.send({ message: 'Zaproszenia zostały wysłane.' });
};

exports.sendInvitationsAdmin = (req, res) => {
  const { emails } = req.body;

  if (!emails || emails.length === 0) {
    return res.status(400).send({ message: 'Brak adresów e-mail do wysłania.' });
  }

  emails.forEach(email => {
    const mailOptions = {
      from: 'no-reply-tester@crem.pl',
      to: email,
      subject: 'Zaproszenie do platformy dotlaw.co',
      html: 'Zapraszamy do platformy dotlaw.co. <br> <a href="https://akademia.dotlaw.co/signup">Twoje doświadczenie zaczyna się tutaj.</a>'
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).send({ message: 'Błąd podczas wysyłania zaproszenia przez admina.' });
      } else {
        console.log('Email wysłany: ' + info.response);
      }
    });
  });

  res.send({ message: 'Zaproszenia zostały wysłane przez admina.' });
};

