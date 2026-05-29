const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const sendTokenCookie = (user, statusCode, res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
    res.status(statusCode).cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000
    }).json({
        success: true,
        token
    });
    res.status(statusCode).json({
        success: true,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            balance: user.balance
        },
        token
    });
};

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if(!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }
        const user = await User.create(req.body);
        sendTokenCookie(user, 201, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }
        const user = await User.findOne({ email }).select('+password');
        if(!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        const isMatch = await user.comparePassword(password);
        if(!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        sendTokenCookie(user, 200, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const logout = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    }).json({
        success: true,
        message: 'Logged out successfully'
    });
};

module.exports = {
    register,
    login,
    logout
};
