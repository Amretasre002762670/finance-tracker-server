require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const pool = require('../db');
const User = require("../models/User");
const authenticateToken = require("../middleware/authMiddleware");

// router
const router = express.Router();
const secretKey = process.env.JWT_SECRETKEY;

// Post is used to send data to the server; Get (no req.body) is used to get data from the server (both register and login)
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ where: { userName: username } });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const user = await User.create({
      userName: username,
      password: hashedPass,
    });
    res.status(201).json({
      id: user.id,
      userName: user.userName,
      message: "User registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { userName: username } });
  console.log("user logged in", user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: "1h" });
    // store the token in local storage or session storage
    res.status(200).json({
      token: token,
      id: user.id,
      username: user.userName,
      message: "Login successful",
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

router.get("/getAll", authenticateToken, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes:["id", "userName"],
    });

    if (users.length === 0) {
      return res.status(204).send();
    }
    res.status(200).json({
      users,
      message: "Users retrieved successfully",
    })
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})

router.get("/getUserId/:username", authenticateToken, async(req, res) => {
  const { username } = req.params;
  try {
    const userId = await User.findOne({ where: { userName: username } });
    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      userId: userId.id,
      message: "User ID retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/deleteUser/:id", authenticateToken, async (req, res) => { 
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
