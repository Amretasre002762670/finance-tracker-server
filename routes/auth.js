require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const pool = require('../db');
const User = require('../models/User');

// router
const router = express.Router();
const secretKey = process.env.JWT_SECRETKEY;

// Post is used to send data to the server; Get (no req.body) is used to get data from the server (both register and login)
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPass = await bcrypt.hash(password, 10);
    const user = await User.create({
        userName: username,
        password: hashedPass
    });
    res.status(201).json({
        id: user.id,
        userName: user.userName,
        message: 'User registered successfully'
    })
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    const user = await User.findOne({ where: { userName: username}});
    console.log("user logged in", user.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found'});
    }

    if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({userId: user.id}, secretKey, {expiresIn: '1h'});
        // store the token in local storage or session storage
        res.status(200).json({
            token: token,
            username: user.userName,
            message: 'Login successful'
        })
    } else {
        res.status(401).json({ message: 'Invalid credentials'});
    }
})

module.exports = router;