const express = require("express");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");
const cors = require("cors");
const router2 = express.Router();
const db = require('./db');


router2.post("/department", async (req, res) => {
    const {id} = req.body
    try {
        const [dept] = await db.promise().query(`
            SELECT * FROM departments where fac_code = ?`, [id]);
        res.json(dept);
    } catch (err) {
        console.error("Error fetching depatrements:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router2.get("/department", async (req, res) => {
    try {
        const [dept] = await db.promise().query(`
            SELECT * FROM departments `);
        res.json(dept);
    } catch (err) {
        console.error("Error fetching depatrements:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router2.get("/faculty", async (req, res) => {
    try {
        const [dept] = await db.promise().query(`
            SELECT * FROM fac_code`);
        res.json(dept);
    } catch (err) {
        console.error("Error fetching faculty:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router2.get("/academic-degree", async (req, res) => {
    try {
        const [ac_degree] = await db.promise().query(`
            SELECT * FROM jobs_code`);
        res.json(ac_degree);
    } catch (err) {
        console.error("Error fetching academic degrees:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});


module.exports = router2;