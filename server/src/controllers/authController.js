const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { blacklistToken } = require('../middlewares/authMiddleware');

const signup = async (req, res) => {
    const { username, password, email, name } = req.body;
    const errors = validationResult(req);
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, email, name });
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        await newUser.save();
        res.status(201).json({ message: `User ${username} created successfully` });
    } catch (err) {
        res.status(500).json({ message: `Error creating user, ${err.message}` });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.status(200).json({ token });
        } else {
            return res.status(401).send('Invalid username or password');
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Server error');
    }
};

const logout = async (req, res) => {
    try {
        await blacklistToken(token);
        return res.sendStatus(204);
    } catch (err) {
        return res.sendStatus(401);
    }
}

module.exports = {
    login,
    logout,
    signup
}
