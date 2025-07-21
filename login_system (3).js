const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');


const router2 = express.Router();
const db = require('./db');
const SECRET_KEY = "my_secret_key"; // Change this to a strong secret key
//const user = { username: "test@example.com", password: "123456" };

// Update user roles by ID
router2.put("/update-roles/:id", (req, res) => {
    const { id } = req.params;
    const { roles } = req.body;  // Expecting roles as a JSON object

    // Convert roles object to JSON string for storage
    const rolesString = JSON.stringify(roles);

    const query = "UPDATE users SET roles = ? WHERE id = ?";

    db.query(query, [rolesString, id], (err, result) => {
        if (err) {
            console.error('Error updating roles:', err);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: `Roles updated successfully for user ID ${id}` });
    });
});


// 📝 Register Route (Hashes password before storing)
router2.get("/delete-user/:id", (req, res) => {
    const { id } = req.params;

    const query = "DELETE FROM users WHERE id = ?";

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: `User with ID ${id} deleted successfully` });
    });
});

// API to list all users
router2.get("/users", (req, res) => {
    const query = "SELECT * FROM users";

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ message: "Internal server error" });
        }

        res.status(200).json(results);
    });
});


router2.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if username exists in the database
    const query = "SELECT * FROM users WHERE username = ?";
    db.query(query, [username], async (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Database error" });
        }

        if (results.length === 0) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const user = results[0];

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Generate JWT token including the role
        const token = jwt.sign(
            { username: user.username, name: user.name, id: user.id, role: user.role }, 
            SECRET_KEY, 
            { expiresIn: "1h" }
        );
        
        return res.json({ success: true, token, role: user.role, name:user.name,});
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
      const insertQuery = "INSERT INTO users (username, name, password_hash, role) VALUES (?, ?, ?, ?)";
      db.query(insertQuery, [username, name, hashedPassword, role], (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ success: false, message: "Error saving user" });
        }
        return res
          .status(201)
          .json({ success: true, message: "User registered successfully", name });
      });
    });
  });
});





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

