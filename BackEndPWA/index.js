const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const pool = require('./config/dbconfig');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());


app.use(cookieParser());
app.use(cors({
    origin: [
        'https://ghss-management.vercel.app', // Production frontend
        'http://localhost:5173',
        'https://pwa-testing1234.vercel.app'
    ],

    credentials: true 
}));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// 📌 1️⃣ Get all students (id & name)
app.get("/students", async (req, res) => {
    try {
        const result = await pool.query("SELECT student_id, name FROM students");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 📌 2️⃣ Mark attendance (Present/Absent)
app.post("/attendance", async (req, res) => {
    try {
        const { student_id, status } = req.body;

        await pool.query(
            "INSERT INTO attendance (student_id, status) VALUES ($1, $2) ON CONFLICT (student_id, date) DO UPDATE SET status = EXCLUDED.status",
            [student_id, status]
        );

        res.json({ message: "Attendance marked successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 📌 3️⃣ Get students with their latest attendance status
app.get("/attendance", async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT s.student_id, s.name, COALESCE(a.status, 'Not Marked') AS status
      FROM students s
      LEFT JOIN (
        SELECT DISTINCT ON (student_id) student_id, status FROM attendance ORDER BY student_id, date DESC
      ) a ON s.student_id = a.student_id
    `);

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
