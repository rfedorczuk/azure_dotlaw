class User {
    constructor(id, email, name, surname, password, voucher, acceptTerms, activationToken, role, isActivated, avatar, company_id) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.surname = surname;
        this.password = password;
        this.voucher = voucher;  // This is redundant now as we have a separate user_vouchers table. Consider removing in future refactor.
        this.acceptTerms = acceptTerms;
        this.activationToken = activationToken;
        this.role = role;
        this.isActivated = isActivated;
        this.avatar = avatar;
        this.company_id = company_id;  // Added company_id attribute
    }
}

module.exports = User;
