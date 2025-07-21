const mysql =require("mysql2");

// Create a database connection pool (better for performance)
const db = mysql.createConnection({
    host: "localhost",
    user: "robotmso_admin",
    password: "Anas2024$#",
    database: "robotmso_Univ_HR",
     timezone: 'Z'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error("Database connection error:", err);
        return;
    }
    console.log("Connected to MySQL database.");
});


// Export the pool so it can be used in other files
module.exports = db
