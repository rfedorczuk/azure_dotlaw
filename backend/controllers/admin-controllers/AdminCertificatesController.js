// controllers/AdminCertificatesController.js
const Certificates = require('../../models/admin-dashboard/certificatesModel');

exports.getCoursesInfo = async (req, res) => {
    try {
        const certificatessInfo = await Certificates.getCoursesInfo();
        res.json(certificatessInfo);
    } catch (error) {
        res.status(500).send('Server Error');
    }
};
