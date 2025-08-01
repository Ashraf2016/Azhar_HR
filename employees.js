const express = require("express");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");
const cors = require("cors");
const router2 = express.Router();
const db = require("./db");

// Get all employees
router2.get("/all", async (req, res) => {
  try {
    const [employees] = await db.promise().query(`
      SELECT *
      FROM employees
      WHERE work_status NOT IN ('اعاره', 'اجازه', 'خروج من الخدمه', 'ايقاف مؤقت', 'بعثه')
    `);
    res.json({ employees, totalEmployees: employees.length });
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get employee by NID
router2.get("/search_nid/:nid", async (req, res) => {
  const { nid } = req.params;
  console.log("ID param:", nid, "Type:", typeof id);
  console.log(`Searching by NID: ${nid}`);

  try {
    const query = `
    SELECT j.*, e.name, e.gender, e.birth_date, e.birth_place, e.residence_place, 
           e.residence_governorate, e.file_number, e.national_id_number, e.document_date
    FROM jobs j
    JOIN employees e ON j.university_file_number = e.university_file_number
    WHERE e.national_id_number = ?
    ORDER BY j.start_date DESC
    LIMIT 1
`;

    const [employee] = await db.promise().query(query, [nid]);

    if (employee.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const base = employee[0];

    const response = {
      name: base.name,
      gender: base.gender,
      birthdate: base.birth_date,
      birthCountry: base.birth_place,
      address: base.residence_place,
      governorate: base.residence_governorate,
      fileNumber: base.file_number,
      nationalID: base.national_id_number,
      nationalIDDate: base.document_date,
      jobData: employee,
    };

    res.json(response);
  } catch (err) {
    console.error("Error fetching employee:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get employee by ID
router2.get("/search/:id", async (req, res) => {
  const { id } = req.params;
  console.log("ID param:", id, "Type:", typeof id);
  console.log(`/search/${id}`);
  try {
    const query = `
    SELECT j.*, e.name, e.gender, e.birth_date, e.birth_place, e.residence_place, 
           e.residence_governorate, e.file_number, e.national_id_number, e.document_date
    FROM jobs j
    JOIN employees e ON j.university_file_number = e.university_file_number
    WHERE j.university_file_number = ?
    ORDER BY j.start_date DESC
    LIMIT 1
`;

    const [employee] = await db.promise().query(query, [parseInt(id)]);

    if (employee.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const base = employee[0];

    const response = {
      name: base.name,
      gender: base.gender,
      birthdate: base.birth_date,
      birthCountry: base.birth_place,
      address: base.residence_address,
      governorate: base.governorate,
      fileNumber: base.file_number,
      nationalID: base.national_id_number,
      nationalIDDate: base.document_date,
      jobData: employee,
    };

    res.json(response);
  } catch (err) {
    console.error("Error fetching employee:", err);
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
        e.gender,
        e.birth_place,
        e.residence_place,
        e.residence_governorate,
        e.national_id_number,
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
      gender: base.gender,
      birthdate: base.birth_date,
      birthCountry: base.birth_place,
      address: base.residence_place,
      governorate: base.residence_governorate,
      fileNumber: base.file_number,
      nationalID: base.national_id_number,
      nationalIDDate: base.national_id_date,
      academicQualifications: [], // No qualifications table yet
      careerProgression: rows
        .filter((r) => r.job_title) // In case LEFT JOIN returned nulls
        .map((row, index) => ({
          No: (index + 1).toString(),
          jobTitle: row.job_title,
          department: row.department_name,
          faculty: row.faculty_name,
          dateOfOccupation: row.date_of_occupation,
          expirationDateOfOccupation: row.expiration_date_of_occupation,
          dateOfStartJob: row.date_of_start_job,
          notes: row.job_notes,
        })),
      previousPosition: {
        title: base.previous_position_title,
        startingDate: base.previous_position_start_date,
        endDate: base.previous_position_end_date,
        serviceType: base.previous_position_service_type,
      },
    };

    res.json(response);
  } catch (err) {
    console.error("Error generating status statement:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router2.get("/deputation-statement/:id", async (req, res) => {
  const { id: academicEmployee } = req.params;

  try {
    const [rows] = await db.promise().query(
      `SELECT
        e.university_file_number,
        e.name,
        e.gender,
        e.birth_date,
        e.birth_place,
        e.residence_place,
        e.residence_governorate,
        e.file_number,
        e.national_id_number,
        e.document_date,
        e.hire_date,
        e.job_code,
        e.current_position,
        e.position_code,
        e.work_status,
        e.status_code,
        e.employment_status,
        d.serial_number,
        d.deputation_code,
        d.deputation_type,
        d.country_code,
        d.deputed_country,
        d.university_name,
        d.deputation_date,
        d.renewal_year,
        d.execution_order_number,
        d.execution_order_date,
        d.notes AS deputation_notes,
        d.from_date AS deputation_start_date,
        d.to_date AS deputation_end_date
      FROM employees e
      LEFT JOIN deputation d ON d.university_file_number = e.university_file_number
      WHERE e.university_file_number = ?
      ORDER BY d.serial_number`,
      [academicEmployee]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const base = rows[0];

    const response = {
      name: base.name,
      gender: base.gender,
      birthdate: base.birth_date,
      birthCountry: base.birth_place,
      address: base.residence_place,
      governorate: base.residence_governorate,
      fileNumber: base.file_number,
      nationalID: base.national_id_number,
      nationalIDDate: base.document_date,
      hireDate: base.hire_date,
      jobCode: base.job_code,
      currentPosition: base.current_position,
      positionCode: base.position_code,
      workStatus: base.work_status,
      statusCode: base.status_code,
      employmentStatus: base.employment_status,
      academicQualifications: [], // No qualifications table yet
      deputationData: rows
        .filter((r) => r.serial_number) // In case LEFT JOIN returned nulls,
        .map((row) => ({
          serialNumber: row.serial_number,
          deputationCode: row.deputation_code,
          deputationType: row.deputation_type,
          deputedCountry: row.deputed_country,
          universityName: row.university_name,
          deputationDate: row.deputation_date,
          renewalYear: row.renewal_year,
          executionOrderNumber: row.execution_order_number,
          executionOrderDate: row.execution_order_date,
          notes: row.deputation_notes,
          deputationStartDate: row.deputation_start_date,
          deputationEndDate: row.deputation_end_date,
        })),
    };

    res.json(response);
  } catch (err) {
    console.error("Error generating status statement:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router2.get("/punishments/:file_number", async (req, res) => {
  const { file_number } = req.params;

  try {
    // First get employee basic info
    const [employeeRows] = await db.promise().query(
      `SELECT name, gender, birth_date, birth_place, residence_place, residence_governorate, 
              file_number, national_id_number, document_date
       FROM employees WHERE file_number = ?`,
      [file_number]
    );

    if (employeeRows.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const base = employeeRows[0];

    // Then get punishments data
    const [punishmentRows] = await db
      .promise()
      .query(`SELECT * FROM punishments WHERE file_number = ?`, [file_number]);

    const response = {
      name: base.name,
      gender: base.gender,
      birthdate: base.birth_date,
      birthCountry: base.birth_place,
      address: base.residence_place,
      governorate: base.residence_governorate,
      fileNumber: base.file_number,
      nationalID: base.national_id_number,
      nationalIDDate: base.document_date,
      punishments: punishmentRows,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching punishments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router2.get("/holidays/:university_file_number", async (req, res) => {
  const { university_file_number } = req.params;

  const employeeId = parseInt(university_file_number, 10);

  if (isNaN(employeeId)) {
    return res.status(400).json({ message: "Invalid ID. Must be a number." });
  }

  try {
    const [employeeRows] = await db.promise().query(
      `SELECT name, gender, birth_date, birth_place, residence_place, residence_governorate, 
              file_number, national_id_number, document_date
       FROM employees WHERE university_file_number = ?`,
      [employeeId]
    );

    if (employeeRows.length === 0) {
      return res.status(404).json({ message: "Employee not found." });
    }

    const base = employeeRows[0];

    const [holidayRows] = await db
      .promise()
      .query(`SELECT * FROM holidays WHERE university_file_number = ?`, [
        employeeId,
      ]);

    const response = {
      name: base.name,
      gender: base.gender,
      birthdate: base.birth_date,
      birthCountry: base.birth_place,
      address: base.residence_place,
      governorate: base.residence_governorate,
      fileNumber: base.file_number,
      nationalID: base.national_id_number,
      nationalIDDate: base.document_date,
      holidays: holidayRows,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching holidays data:", error);
    res.status(500).json({ message: "Database query failed." });
  }
});

module.exports = router2;
