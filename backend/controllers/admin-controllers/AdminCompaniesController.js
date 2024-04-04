// controllers/CompanyController.js
const Company = require('../../models/admin-dashboard/companiesModel');

exports.getCompanies = async (req, res) => {
    try {
        const companies = await Company.getCompanyDetails();
        res.json(companies);
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

exports.updateCompanyName = async (req, res) => {
    console.log('req ',req.body.company_name,'  param ',req.params)
    try {
        const { companyId } = req.params; // Pobieranie companyId z parametrów URL
        const newName  = req.body.company_name; // Pobieranie newName z ciała żądania
        console.log('companyId: ',companyId,' newName: ',newName);
        await Company.updateCompanyName(companyId, newName);
        res.json({ message: 'Company name updated successfully' });
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

exports.addCompanyVoucher = async (req, res) => {
    console.log(JSON.stringify(req.body))
    try {
        const { companyId } = req.params; // Pobieranie companyId z parametrów URL
        const { voucherCode } = req.body; // Pobieranie voucherCode z ciała żądania
        console.log('companyId: ', companyId, ' voucherCode: ', voucherCode);
        await Company.addCompanyVoucher(companyId, voucherCode);
        res.json({ message: 'Voucher added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};


exports.deleteCompany = async (req, res) => {
    try {
        const { companyId } = req.params;
        await Company.deleteCompany(companyId);
        res.json({ message: 'Company deleted successfully' });
    } catch (error) {
        res.status(500).send('Server Error');
    }
};
