const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const router2 = express.Router();
const db = require("./db");
const SECRET_KEY = "my_secret_key"; // Change this to a strong secret key
//const user = { username: "test@example.com", password: "123456" };

router2.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username exists in the database
  const query = "SELECT * FROM users WHERE username = ?";
  db.query(query, [username], async (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }

    if (results.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const user = results[0];

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT token including the role
    const token = jwt.sign(
      {
        username: user.username,
        name: user.name,
        id: user.id,
        role: user.role,
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    return res.json({ success: true, token, role: user.role, name: user.name });
  });
});

router2.post("/register", (req, res) => {
  const { username, password, name, role } = req.body;

  // Check if the username already exists
  const checkQuery = "SELECT * FROM users WHERE username = ?";
  db.query(checkQuery, [username], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Database error during check" });
    }

    if (results.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Username already registered" });
    }

    // Hash the password before storing
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Error hashing password" });
      }

      // Insert the new user into the database
      const insertQuery =
        "INSERT INTO users (username, name, password_hash, role) VALUES (?, ?, ?, ?)";
      db.query(
        insertQuery,
        [username, name, hashedPassword, role],
        (err, result) => {
          if (err) {
            return res
              .status(500)
              .json({ success: false, message: "Error saving user" });
          }
          return res.status(201).json({
            success: true,
            message: "User registered successfully",
            name,
          });
        }
      );
    });
  });
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access token required" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Change password endpoint
router2.post(
  "/change-password",
  // authenticateToken,
  async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    // Get user from database
    const getUserQuery = "SELECT * FROM users WHERE id = ?";
    db.query(getUserQuery, [userId], async (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      }

      if (results.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      const user = results[0];

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password_hash
      );
      if (!isCurrentPasswordValid) {
        return res
          .status(401)
          .json({ success: false, message: "Current password is incorrect" });
      }

      // Hash the new password
      bcrypt.hash(newPassword, 10, (err, hashedNewPassword) => {
        if (err) {
          return res
            .status(500)
            .json({ success: false, message: "Error hashing new password" });
        }

        // Update password in database
        const updateQuery = "UPDATE users SET password_hash = ? WHERE id = ?";
        db.query(updateQuery, [hashedNewPassword, userId], (err, result) => {
          if (err) {
            return res
              .status(500)
              .json({ success: false, message: "Error updating password" });
          }

          return res.json({
            success: true,
            message: "Password changed successfully",
          });
        });
      });
    });
  }
);
/*
router2.post("/register", (req, res) => {
  const { username, password } = req.body;
 
 
  // Check if the username already exists
 
  
  db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Database error during check" });
    }

    if (results.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Username already registered" });
    }

    // Hash the password before storing
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Error hashing password" });
      }

      // Insert the new user into the database
      const insertQuery =
        "INSERT INTO users (username, password) VALUES (?, ?)";
      db.query(insertQuery, [username, hashedPassword], (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ success: false, message: "Error saving user" });
        }
        return res
          .status(201)
          .json({ success: true, message: "User registered successfully" });
      });
    });
  });
});
*/

/*
router2.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === user.username && password === user.password) {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
        return res.json({ success: true, token });
    } else {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
});
*/

module.exports = router2;
