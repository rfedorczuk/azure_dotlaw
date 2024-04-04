// router/userRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const UserController = require('../../controllers/UsersController');
const AuthController = require('../../controllers/AuthController');
const adminUsersController = require('../../controllers/admin-controllers/AdminUsersController');
const authMiddleware = require('../../middlewares/isAuthenticated'); 

router.get('/get/:id', authMiddleware, async (req, res) => {
    try {
        const userProfile = await UserController.getProfile(req.params.id);
        if (userProfile) {
            res.status(200).json(userProfile);
        } else {
            res.status(404).json({ message: 'Profile not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
});

// W userRouter.js
router.put('/update/:id', authMiddleware, upload.single('avatar'), async (req, res) => {
  try {
    const { email, name, surname, role } = req.body; // Dodaj role do destrukturyzacji
    const avatar = req.file;
    const avatarBase64 = await UserController.updateProfile(req.params.id, email, name, surname, avatar, role); // Przekazanie role
    res.status(200).json({ message: 'Profile updated successfully', avatar: avatarBase64 });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

  
  
router.delete('/delete/:userId', authMiddleware, adminUsersController.deleteUser);
  

// router.put('/update/:id', upload.single('avatar'), async (req, res) => {
//     try {
//         const { email, name } = req.body;
//         const avatar = req.file;  // Pobierz przesłany avatar
//         await UserController.updateProfile(req.params.id, email, name, avatar);
//         res.status(200).json({ message: 'Profile updated successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Error updating profile', error: error.message });
//     }
// });

// w pliku router, np. `userRoutes.js`

router.post('/change-password', authMiddleware, AuthController.changePassword);


module.exports = router;
