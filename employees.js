const express = require("express");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");
const cors = require("cors");
const router2 = express.Router();
const db = require('./db');

// Get all employees
router2.get("/all", async (req, res) => {
  try {
    const [employees] = await db.promise().query(`
      SELECT *
      FROM employees
      WHERE work_status NOT IN ('اعاره', 'اجازه', 'خروج من الخدمه', 'ايقاف مؤقت', 'بعثه')
    `);
    res.json({employees, totalEmployees:employees.length});
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get employee by ID
router2.get("/search/:id", async (req, res) => {
    const { id } = req.params;
    console.log("ID param:", id, "Type:", typeof id);
    console.log(`/search/${id}`)
    try {
       const query = `
    SELECT j.*, e.name
    FROM jobs j
    JOIN employees e ON j.university_file_number = e.university_file_number
    WHERE j.university_file_number = ?
    ORDER BY j.start_date DESC
    LIMIT 1
`;

        
        const [employee] = await db.promise().query(query, [parseInt(id)]);
            
            
        res.json(employee);
    } catch (err) {
        console.error("Error fetching employee:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// List jobs with optional filters
router2.get("/list", async (req, res) => {
    const { fac, dept, degree } = req.query;
    console.log(`/list?fac=${fac}&dept=${dept}&degree=${degree}`);

    const params = [];
    const filters = [];

    if (dept !== undefined) {
        filters.push(`j.department_code = ?`);
        params.push(parseInt(dept));
    }

    if (fac !== undefined) {
        filters.push(`j.faculty_code = ?`);
        params.push(parseInt(fac));
    }

    if (degree !== undefined) {
        filters.push(`j.job_code = ?`);
        params.push(parseInt(degree));
    }

    // Construct full SQL with dynamic filtering
    let query = `
        SELECT j.*, e.name
        FROM jobs j
        JOIN (
            SELECT university_file_number, MAX(start_date) AS latest_start_date
            FROM jobs
            ${dept !== undefined ? `WHERE department_code = ?` : ``}
            GROUP BY university_file_number
        ) latest
            ON j.university_file_number = latest.university_file_number
            AND j.start_date = latest.latest_start_date
        JOIN employees e ON j.university_file_number = e.university_file_number
    `;

    // Push department_code again if used in subquery
    if (dept !== undefined) {
        params.unshift(parseInt(dept)); // unshift ensures it's first param for subquery
    }

    if (filters.length > 0) {
        query += ` WHERE ` + filters.join(" AND ");
    }

    try {
        console.log("Query:", query);
        console.log("Params:", params);
        const [results] = await db.promise().query(query, params);
        res.json(results);
    } catch (err) {
        console.error("Error fetching filtered job list:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Get jobs by department code
router2.get("/department/:id", async (req, res) => {
    const { id: deptCode } = req.params;
    console.log(`/department/${deptCode}`)

    try {
        const [results] = await db.promise().query(
            "SELECT * FROM jobs WHERE department_code = ?",
            [parseInt(deptCode)]
        );
        res.json(results);
    } catch (err) {
        console.error("Error fetching department jobs:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Get jobs by faculty code
router2.get("/faculty/:id", async (req, res) => {
    const { id: facCode } = req.params;
    console.log(`/faculty/${facCode}`)
    try {
        const [results] = await db.promise().query(
            "SELECT * FROM jobs WHERE faculty_code = ?",
            [parseInt(facCode)]
        );
        res.json(results);
    } catch (err) {
        console.error("Error fetching faculty jobs:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Get jobs by academic degree (job code)
router2.get("/academic-degree/:id", async (req, res) => {
    const { id: jobCode } = req.params;
    console.log(`/academic-degree/${jobCode}`)
    try {
        const [results] = await db.promise().query(
            "SELECT * FROM jobs WHERE job_code = ?",
            [parseInt(jobCode)]
        );
        res.json(results);
    } catch (err) {
        console.error("Error fetching academic degree jobs:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});


router2.get("/status-statement/:id", async (req, res) => {
  const { id: academicEmployee } = req.params;

  try {
    const [rows] = await db.promise().query(
      `SELECT
        e.university_file_number,
        e.name,
        e.birth_date,
        e.file_number,
        e.document_date AS national_id_date,
        e.previous_position AS previous_position_title,
        e.from_date AS previous_position_start_date,
        e.to_date AS previous_position_end_date,
        e.gov_or_non_gov AS previous_position_service_type,
        j.job_title,
        j.department_name,
        j.faculty_name,
        j.start_date AS date_of_occupation,
        j.end_date AS expiration_date_of_occupation,
        j.job_start_date AS date_of_start_job,
        j.notes AS job_notes
      FROM employees e
      LEFT JOIN jobs j ON j.university_file_number = e.university_file_number
      WHERE e.university_file_number = ?
      ORDER BY j.start_date`,
      [academicEmployee]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const base = rows[0];

    const response = {
      name: base.name,
      gender: null,                  // Not in schema
      birthdate: base.birth_date,
      birthCountry: null,            // Not in schema
      address: null,                 // Not in schema
      governorate: null,             // Not in schema
      fileNumber: base.file_number,
      nationalID: null,              // Not in schema
      nationalIDDate: base.national_id_date,
      academicQualifications: [],    // No qualifications table yet
      careerProgression: rows
        .filter(r => r.job_title) // In case LEFT JOIN returned nulls
        .map((row, index) => ({
          No: (index + 1).toString(),
          jobTitle: row.job_title,
          department: row.department_name,
          faculty: row.faculty_name,
          dateOfOccupation: row.date_of_occupation,
          expirationDateOfOccupation: row.expiration_date_of_occupation,
          dateOfStartJob: row.date_of_start_job,
          notes: row.job_notes
        })),
      previousPosition: {
        title: base.previous_position_title,
        startingDate: base.previous_position_start_date,
        endDate: base.previous_position_end_date,
        serviceType: base.previous_position_service_type
      }
    };

    res.json(response);
  } catch (err) {
    console.error("Error generating status statement:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router2;