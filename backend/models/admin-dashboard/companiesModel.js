// models/Company.js
const sql = require('../../config/db');

class Company {
    static async getCompanyDetails() {
        const query = `
        SELECT 
    c.id,
    c.company_name,
    GROUP_CONCAT(DISTINCT CONCAT(m.name, ' ', m.surname) ORDER BY m.id SEPARATOR ', ') AS representative,
    c.created_at,
    (SELECT COUNT(*) FROM users WHERE company_id = c.id) AS participants_count,
    GROUP_CONCAT(DISTINCT v.voucher_code ORDER BY v.id SEPARATOR ', ') AS vouchers
FROM 
    companies c
LEFT JOIN 
    users m ON m.company_id = c.id AND m.role = 'manager'
LEFT JOIN
    vouchers v ON v.company_id = c.id
GROUP BY 
    c.id, c.company_name, c.created_at;

        `;
        try {
            const [results] = await sql.query(query);
            return results;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async updateCompanyName(companyId, newName) {
        const query = `
            UPDATE companies
            SET company_name = ?
            WHERE id = ?
        `;
        try {
            console.log(`Updating company name for companyId: ${companyId}, newName: ${newName}`);
            await sql.query(query, [newName, companyId]);
            console.log('Company name updated successfully');
            return true;
        } catch (error) {
            console.error('Error updating company name:', error);
            throw error;
        }
    }

    static async addCompanyVoucher(companyId, voucherCode) {
    const query = `
        INSERT INTO vouchers (company_id, voucher_code)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE voucher_code = VALUES(voucher_code);
    `;
    try {
        console.log(`Adding or updating voucher for companyId: ${companyId}, voucherCode: ${voucherCode}`);
        await sql.query(query, [companyId, voucherCode]);
        console.log('Voucher added or updated successfully');
        return true;
    } catch (error) {
        console.error('Error adding or updating voucher:', error);
        throw error;
    }
}

    
    

    static async deleteCompany(companyId) {
        const query = `
            DELETE FROM companies
            WHERE id = ?
        `;
        try {
            await sql.query(query, [companyId]);
            return true;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Company;
