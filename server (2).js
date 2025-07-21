const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();

// Replace bodyParser with Express's built-in middleware
app.use(express.json()); // Handles application/json
app.use(express.urlencoded({ extended: true })); // Handles application/x-www-form-urlencoded
app.use(cors());

const db = require('./db');
const multer = require('multer');


// Import all your routes
const employee_routes = require('./employees');
const structure_routes = require('./structure');
const login_routes = require('./login_system');

// Setup all routes
app.use('/employee', employee_routes);
app.use('/structure', structure_routes);
app.use('/login_system', login_routes);



// Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Handle Multer file upload errors
        return res.status(400).json({ 
            error: err.message,
            code: err.code, // e.g., 'LIMIT_FILE_SIZE'
            field: err.field // Which field caused the error
        });
    } else if (err) {
        // Handle other errors
        console.error(err.stack);
        return res.status(500).json({ 
            error: err.message,
            type: err.name
        });
    }
    next();
});

// Start the server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});