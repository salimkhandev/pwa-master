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
        'https://pwa-frontend2-orcin.vercel.app',
        'https://pwa-frontend-123.vercel.app'
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

app.post("/attendance", async (req, res) => {
    try {
        let attendanceRecords = req.body;

        // If a single object is sent, convert it into an array
        if (!Array.isArray(attendanceRecords)) {
            attendanceRecords = [attendanceRecords];
        }

        if (attendanceRecords.length === 0) {
            return res.status(400).json({ error: "Invalid input: No attendance records provided" });
        }

        // Prepare values for bulk insert
        const values = attendanceRecords.map(({ student_id, status }) =>
            `(${student_id}, '${status}', CURRENT_DATE)`
        ).join(", ");

        const query = `
            INSERT INTO attendance (student_id, status, date) 
            VALUES ${values} 
            ON CONFLICT (student_id, date) 
            DO UPDATE SET status = EXCLUDED.status
            RETURNING *;
        `;

        const result = await pool.query(query);

        res.json({
            message: "Attendance marked successfully",
            data: result.rows
        });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: err.message });
    }
});


// 📌 3️⃣ Get students with their latest attendance status
app.get("/attendance", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                s.student_id as id,
                s.name,
                COALESCE(a.status, 'Not Marked') AS status
            FROM students s
            LEFT JOIN (
                SELECT DISTINCT ON (student_id) 
                    student_id, 
                    status,
                    date
                FROM attendance 
                ORDER BY student_id, date DESC
            ) a ON s.student_id = a.student_id
            ORDER BY s.student_id
        `);

        res.json(result.rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
