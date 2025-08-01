const express = require("express");
const router2 = express.Router();
const db = require("./db");

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
  console.log(`/department/${deptCode}`);

  try {
    const [results] = await db
      .promise()
      .query("SELECT * FROM jobs WHERE department_code = ?", [
        parseInt(deptCode),
      ]);
    res.json(results);
  } catch (err) {
    console.error("Error fetching department jobs:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get jobs by faculty code
router2.get("/faculty/:id", async (req, res) => {
  const { id: facCode } = req.params;
  console.log(`/faculty/${facCode}`);
  try {
    const [results] = await db
      .promise()
      .query("SELECT * FROM jobs WHERE faculty_code = ?", [parseInt(facCode)]);
    res.json(results);
  } catch (err) {
    console.error("Error fetching faculty jobs:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get jobs by academic degree (job code)
router2.get("/academic-degree/:id", async (req, res) => {
  const { id: jobCode } = req.params;
  console.log(`/academic-degree/${jobCode}`);
  try {
    const [results] = await db
      .promise()
      .query("SELECT * FROM jobs WHERE job_code = ?", [parseInt(jobCode)]);
    res.json(results);
  } catch (err) {
    console.error("Error fetching academic degree jobs:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router2;
