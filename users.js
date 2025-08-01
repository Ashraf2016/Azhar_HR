const express = require("express");
const router2 = express.Router();
const db = require("./db");

// Update user roles by ID
router2.put("/:id", (req, res) => {
  const { id } = req.params;
  const { roles } = req.body; // Expecting roles as a JSON object

  // Convert roles object to JSON string for storage
  const rolesString = JSON.stringify(roles);

  const query = "UPDATE users SET roles = ? WHERE id = ?";

  db.query(query, [rolesString, id], (err, result) => {
    if (err) {
      console.error("Error updating roles:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: `Roles updated successfully for user ID ${id}` });
  });
});

// Delete user by ID
router2.delete("/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM users WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting user:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: `User with ID ${id} deleted successfully` });
  });
});

// Get all users
router2.get("/all", (req, res) => {
  const query = "SELECT * FROM users";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    res.status(200).json(results);
  });
});

module.exports = router2;
