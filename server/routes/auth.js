const express = require('express');
const router = express.Router();
const { register, login, getMe, getAllUsers, updateProfile, deleteUser } = require('../controllers/authController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);
router.get('/users', auth, admin, getAllUsers);
router.put('/profile', auth, updateProfile);
router.delete('/users/:id', auth, admin, deleteUser);

module.exports = router;
