const db = require('../config/db.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const crypto = require('crypto');
const User = require('../models/website/users.js');
const transport = require('../config/mail');
const UsersController = require('../controllers/UsersController.js');

console.log('JWT_SECRET_KEY:', process.env.JWT_SECRET_KEY);

class AuthController {
    
    static validateUserSchema(user) {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            name: Joi.string().min(3).max(50).required(),
            surname: Joi.string().min(3).max(60).required(),
            password: Joi.string().min(8).required(),
            voucher: Joi.string().optional(),
            acceptTerms: Joi.boolean().valid(true).required(),
            role: Joi.string().valid('user', 'manager', 'admin', 'superadmin').required()
        });

        return schema.validate(user);
    }

    static async register(req, res) {
        const validationResult = AuthController.validateUserSchema(req.body);
        console.log(JSON.stringify(req.body))
        console.log('req.body.voucher ',req.body.voucher)
        if (validationResult.error) {
            return res.status(400).json({ message: validationResult.error.details[0].message });
        }
    
        try {
            const userExists = await UsersController.findByEmail(req.body.email);
            if (userExists) {
                return res.status(409).json({ message: 'User with this email already exists.' });
            }
    
            // Sprawdzanie istnienia kodu voucheru tylko jeśli jest podany
            let voucherId = null;
            if (req.body.voucher) {
                const [voucherRows] = await db.query('SELECT * FROM vouchers WHERE voucher_code = ?', [req.body.voucher]);
                if (!voucherRows.length) {
                    return res.status(400).json({ message: 'Invalid voucher code.' });
                }
                voucherId = voucherRows[0].id;
            }
    
            // Tworzenie użytkownika z opcjonalnym ID voucheru
            const user = await UsersController.save(req.body.email, req.body.name, req.body.surname, req.body.password, req.body.voucher, req.body.acceptTerms, req.body.role);
    
            // Dodanie do tabeli user_vouchers tylko jeśli istnieje voucherId
            if (voucherId) {
                await db.query('INSERT INTO user_vouchers (user_id, voucher_id) VALUES (?, ?)', [user.id, voucherId]);
            }
    
            // Wysłanie maila aktywacyjnego i odpowiedź
            const activationLink = `${process.env.ACTIVATION_URI}/${user.activationToken}`;
            await transport.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Potwierdzenie rejestracji',
                text: `Aktywuj konto`,
                html: `Kliknij w poniższy link, aby aktywować konto: ${user.email} <br> <a href="${activationLink}">Aktywuj konto</a>`
            });
    
            res.status(201).json({ message: 'User registered successfully. Please check your email to activate the account.' });
        } catch (error) {
            console.error("Error in register:", error);
            res.status(500).json({ message: 'Server error.' });
        }
    }
    
    

static async activateAccount(req, res) {
    console.log('wywoluje')
    const token = req.params.token;
    console.log('token: ' + token);
    try {
        const user = await UsersController.findByActivationToken(token);
        console.log('user ' + user);
    
        if (!user) {
            // Przekierowanie do strony logowania z komunikatem o niepowodzeniu
            return res.redirect(`${process.env.ACTIVATION_FRONT_URI}?message=invalidToken`);
        }
    
        user.activationToken = null;
        await UsersController.setAccountAsActivated(user.id);  // Zakładając, że ta metoda aktualizuje użytkownika w bazie
    
        // Przekierowanie do strony logowania z komunikatem o sukcesie
        res.redirect(`${process.env.ACTIVATION_FRONT_URI}?message=activationSuccessful`);
    } catch (error) {
        console.error("Activation error:", error);
        // Przekierowanie do strony logowania z komunikatem o błędzie
        res.redirect(`${process.env.ACTIVATION_FRONT_URI}?message=activationError`);
    }
}


    static async login(req, res) {
        console.log('JWT_SECRET_KEY:', process.env.JWT_SECRET_KEY);
      console.log('login ',JSON.stringify(req.body))
        try {
           const user = await UsersController.findByEmail(req.body.email);
           console.log('user ', user)
            const userProfile = await UsersController.getProfile(user.id);
            console.log('userProfile ',userProfile)
            console.log('userProfile ',userProfile)
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password.' });
            }
    
            // Sprawdzanie, czy konto jest aktywowane
            if (!user.isActivated) {
                return res.status(401).json({ message: 'Your account is not activated. Please check your email to activate your account.' });
            }
    
            const isPasswordValid = await UsersController.validatePassword(req.body.password, user.password);
            console.log(isPasswordValid)
if (!isPasswordValid) {
    return res.status(400).json({
        error: 'incorrect_password',
        message: 'The current password is incorrect.'
    });
}

    
            // Generowanie JWT
            const token = jwt.sign({ userId: user.id, companyId: userProfile.company_id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
         console.log('token cookie ' + token)
    
            // Umieszczanie JWT w httpOnly cookie
           // res.cookie('token', token, { httpOnly: false, secure: false, sameSite: 'Strict', path: '/' });
          // res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict', path: '/' });
         // res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'None', path: '/' });
// Ustawienie ciasteczka z tokenem
res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'None', path: '/' });


// Sprawdzenie, czy ciasteczko z tokenem zostało pomyślnie ustawione
if (req.cookies['token'] === token) {
    console.log('Token został pomyślnie wysłany do ciasteczka.');
} else {
    console.log('Nie udało się wysłać tokenu do ciasteczka.');
}


    
            res.status(200).json({
                message: 'Logged in successfully',
                userData: {
                    userId: user.id,
                    userName: user.name,
                    surname: user.surname,
                    email: user.email,
                    role: user.role,
                    avatar: userProfile.avatar, // Dodaj URL avatara
                    companyId: userProfile.company_id // Dodaj company_id
                }
            });
    
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An error occurred while trying to log in.' });
        }
    }
    


    static validateChangePasswordSchema(data) {
        const schema = Joi.object({
            currentPassword: Joi.string().min(8).required(),
            newPassword: Joi.string().min(8).required()
        });

        return schema.validate(data);
    }

    static async changePassword(req, res) {
        console.log('req.userId z authcontroller ',req.userId)
        // Walidacja danych wejściowych
        const { error } = AuthController.validateChangePasswordSchema(req.body);
        if (error) {
            return res.status(400).json({
                error: 'validation_error',
                message: error.details[0].message
            });
        }

        try {
            // Pobranie ID użytkownika z middleware JWT
            const userId = req.userId;

            const user = await UsersController.findById(userId);
            if (!user) {
                return res.status(404).json({
                    error: 'user_not_found',
                    message: 'User not found.'
                });
            }

            console.log('user ',user);

            const isPasswordValid = await bcrypt.compare(req.body.currentPassword, user.password);
            console.log('changepassword ',req.body.currentPassword,' user.password ',user.password)
            if (!isPasswordValid) {
                return res.status(400).json({
                    error: 'incorrect_password',
                    message: 'The current password is incorrect.'
                });
            }

            console.log('isPasswordValid ',isPasswordValid)

            const newPassword = await bcrypt.hash(req.body.newPassword, 12);
            console.log('newPassword ',newPassword)
            await UsersController.changeUserPassword(user.id, newPassword);

            res.status(200).json({
                message: 'Password has been updated successfully.'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: 'server_error',
                message: 'An error occurred while changing the password. Please try again later.'
            });
        }
    }

    
    
    
}
	module.exports = AuthController;