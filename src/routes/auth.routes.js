const express = require('express');
const router = express.Router();

const { register, login, logout } = require('../controllers/auth.controller');
const verifyToken = require('../middleware/auth.middleware');


router.post('/register', verifyToken, register);
router.post('/login', verifyToken,login);
router.post('/logout', verifyToken, logout);

module.export = router
