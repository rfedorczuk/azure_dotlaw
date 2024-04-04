const router = require('express').Router();
const certificateController = require('../../controllers/course-controllers/course_certificate/certificateController');
const CourseCertificate = require('../../models/dashboard/user_courses/user_certificate/courseCertificate');
const courseModel = require('../../models/dashboard/user_courses/courseModel');
const JSZip = require('jszip');
const authMiddleware = require('../../middlewares/isAuthenticated'); 

// Zmiana z .get na .post
router.post('/generate-pdf',authMiddleware, async (req, res) => {
  // Dane otrzymywane z ciała żądania (req.body)
  const { courseName, userName, date, courseId, userId } = req.body;
  
  const courseCertificate = new CourseCertificate(courseName, userName, date, courseId, userId);

  try {
    const pdfBytes = await certificateController.generateCertificate(courseCertificate);
    // Tworzenie bufora z bajtów PDF
    const pdfBuffer = Buffer.from(pdfBytes);
    
    // Ustawienie nagłówków odpowiedzi i wysyłanie bufora PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=certificate.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/download-certificate/:userId/:courseId',authMiddleware, async (req, res) => {
    const { userId, courseId } = req.params;
    const certificateBlob = await courseModel.getCertificateBlob(userId, courseId);
    if (certificateBlob) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=certificate.pdf');
        res.send(certificateBlob);
    } else {
        res.status(404).send('Certificate not found.');
    }
});

router.get('/all-certificates/:companyId',authMiddleware, async (req, res) => {
  const { companyId } = req.params;
  try {
      const certificates = await courseModel.getAllCertificates(companyId);
      if (certificates.length > 0) {
          const zip = new JSZip();
          
          certificates.forEach((certificate, index) => {
              // Zakładamy, że certificate.certificate_blob jest Bufferem
              if (certificate.certificate_blob) {
                  // Tworzenie nazwy pliku dla każdego certyfikatu
                  const fileName = `certificate-${certificate.user_id}-${certificate.course_id}.pdf`;
                  // Dodawanie pliku do archiwum ZIP
                  zip.file(fileName, certificate.certificate_blob);
              }
          });

          // Generowanie archiwum ZIP i wysyłanie jako odpowiedź
          zip.generateAsync({ type: 'nodebuffer' })
              .then(function(content) {
                  res.setHeader('Content-Type', 'application/zip');
                  res.setHeader('Content-Disposition', 'attachment; filename=certificates.zip');
                  res.send(content);
              });
      } else {
          res.status(404).send('No certificates found.');
      }
  } catch (error) {
      console.error('Error fetching certificates:', error);
      res.status(500).send('Internal server error.');
  }
});

// Add to certificateRouter.js (Node.js/Express)
router.get('/user-certificate/:userId',authMiddleware, async (req, res) => {
  const { userId } = req.params;
  try {
    // Assuming this function exists and it returns certificates for the user
    const certificates = await courseModel.getCertificatesForUser(userId);
    res.json(certificates);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;
