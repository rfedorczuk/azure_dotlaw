const db = require('../config/db.js');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/website/users.js');

//const { SERVER_URL, JWT_SECRET_KEY } = process.env;

class UsersController {

  static async findByEmail(email) {
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      if (rows.length) {
        const userData = rows[0];
        console.log('userData ',userData)
        return new User(
          userData.id, 
          userData.email, 
          userData.name, 
          userData.surname,
          userData.password, 
          userData.voucher, 
          userData.accept_terms, 
          userData.activation_token,
          userData.role, 
          userData.is_activated
        );
      }
      return null;
    } catch (error) {
      throw error;
    }
}


  static async findById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
      if (rows.length) {
        const userData = rows[0];
        return new User(
          userData.id,
          userData.email, 
          userData.name, 
          userData.surname,
          userData.password,
           userData.voucher, 
           userData.accept_terms, 
           userData.activation_token
        );
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  static async findByActivationToken(token) {
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE activation_token = ?', [token]);
      if (rows.length) {
        const userData = rows[0];
        return new User(
          userData.id, userData.email, userData.name, userData.surname,
          userData.password, userData.voucher, userData.accept_terms, userData.activation_token
        );
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  static async setAccountAsActivated(userId) {
    try {
        await db.query('UPDATE users SET is_activated = TRUE WHERE id = ?', [userId]);
    } catch (error) {
        throw error;
    }
}


static async save(email, name, surname, password, voucherCode, acceptTerms, role) {
  console.log(email, name, surname, password, 'voucher: ',voucherCode, acceptTerms, role)
  try {
      if (password) {
          password = await bcrypt.hash(password, 12);
      }
      const activationToken = crypto.randomBytes(32).toString('hex');

      let companyId = null;
      let voucherId = null;

      // Jeśli kod vouchera został podany, weryfikujemy go i pobieramy companyId
      if (voucherCode) {
          const [voucherRows] = await db.query('SELECT id, company_id FROM vouchers WHERE voucher_code = ?', [voucherCode]);
          if (!voucherRows.length) {
              throw new Error('Invalid voucher code');
          }
          companyId = voucherRows[0].company_id; // Get company_id
          voucherId = voucherRows[0].id; // Get voucher_id
      }

      // Dodajemy użytkownika do bazy danych, uwzględniając możliwość braku companyId i voucherId
      const result = await db.query('INSERT INTO users (email, name, surname, password, voucher_id, accept_terms, activation_token, role, company_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
          [email, name, surname, password, voucherId, acceptTerms, activationToken, role, companyId]);

      const userId = result[0].insertId;

      // Zwracamy nowo utworzonego użytkownika
      return new User(userId, email, name, surname, password, voucherCode, acceptTerms, activationToken, role, companyId);
  } catch (error) {
      throw error;
  }
}



  static async validatePassword(inputPassword, hashedPassword) {
    return bcrypt.compare(inputPassword, hashedPassword);
  }

  static async update(user) {
    console.log('user update: ',JSON.stringify(user))
    try {
        if (user.password) {
            user.password = await bcrypt.hash(user.password, 12);
        }
        await db.query(`
            UPDATE users 
            SET email = ?, name = ?, surname = ?, password = ?, voucher = ?, accept_terms = ?, activation_token = ?
            WHERE id = ?
        `, [user.email, user.name, user.surname, user.password, user.voucher, user.acceptTerms, user.activationToken, user.id]);

    } catch (error) {
        throw error;
    }
  }
  static async changeUserPassword(id, hashedNewPassword) {
    console.log('changeUserPassword ',id,' ',hashedNewPassword);
    try {
        await db.query(`
            UPDATE users 
            SET password = ?
            WHERE id = ?
        `, [hashedNewPassword, id]);
    } catch (error) {
        throw error;
    }
}

static async updateProfile(id, email, name, surname, avatar, role) {
  try {
    // Rozpocznij tworzenie listy części zapytania oraz listy parametrów.
    let queryParts = ["UPDATE users SET"];
    let setClauses = [];
    let params = [];

    // Dodaj poszczególne części zapytania i parametry dla email, name, surname.
    setClauses.push("email = ?");
    params.push(email);

    setClauses.push("name = ?");
    params.push(name);

    setClauses.push("surname = ?");
    params.push(surname);

    // Dodaj avatar i role do zapytania, jeśli zostały dostarczone.
    if (avatar) {
      setClauses.push("avatar = ?");
      params.push(avatar.buffer);
    }

    if (role) {
      setClauses.push("role = ?");
      params.push(role);
    }

    // Dołącz części zapytania z użyciem przecinka jako separatora i dodaj klauzulę WHERE.
    queryParts.push(setClauses.join(", "));
    queryParts.push("WHERE id = ?");
    params.push(id);

    // Połącz części w pełne zapytanie SQL.
    let query = queryParts.join(" ");

    await db.query(query, params);
    
    // Pobierz ponownie dane użytkownika, aby uzyskać zaktualizowany avatar.
    const [rows] = await db.query('SELECT avatar FROM users WHERE id = ?', [id]);
    if (rows.length) {
      const userAvatar = rows[0].avatar;
      const avatarBase64 = userAvatar ? `data:image/jpeg;base64,${userAvatar.toString('base64')}` : null;
      return avatarBase64;
    }
    return null;
  } catch (error) {
    throw error;
  }
}



// static async updateProfile(id, email, name, surname, avatar, role) { // Dodaj role jako argument
//   try {
//     let query = `UPDATE users SET email = ?, name = ?, surname = ?${avatar ? ", avatar = ?" : ""}, role = ? WHERE id = ?`; // Dodaj role do zapytania
//     let params = avatar ? [email, name, surname, avatar.buffer, role, id] : [email, name, surname, role, id]; // Ustawianie parametrów z uwzględnieniem roli
//     await db.query(query, params);
    
//     // Pobierz ponownie dane użytkownika (brak zmian tutaj)
//     const [rows] = await db.query('SELECT avatar FROM users WHERE id = ?', [id]);
//     if (rows.length) {
//       const userAvatar = rows[0].avatar;
//       const avatarBase64 = userAvatar ? `data:image/jpeg;base64,${userAvatar.toString('base64')}` : null;
//       return avatarBase64;
//     }
//     return null;
//   } catch (error) {
//     throw error;
//   }
// }


static async checkIfUserEnrolled(req, res) {
  try {
    const userId = req.params.userId;
    const courseId = req.params.courseId;

    const result = await db.query(`
      SELECT * FROM user_courses 
      WHERE user_id = ? AND course_id = ?
    `, [userId, courseId]);

    if (result[0].length > 0) {
      res.status(200).json({ enrolled: true });
    } else {
      res.status(200).json({ enrolled: false });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}


static async getProfile(id) {
  try {
      const [rows] = await db.query(`
          SELECT users.id, users.company_id, users.email, users.name, users.surname, users.avatar, users.role, vouchers.voucher_code 
          FROM users 
          LEFT JOIN vouchers ON users.voucher_id = vouchers.id
          WHERE users.id = ?
      `, [id]);
      if (rows.length) {
        let user = rows[0];
        if (user.avatar) {
         // console.log(user.avatar)
            user.avatar = `data:image/jpeg;base64,${user.avatar.toString('base64')}`;
        }
          return user;
      }
      return null;
  } catch (error) {
      throw error;
  }
}




}

module.exports = UsersController;