import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: '../.env' });
dotenv.config();

const app = express();
const port = process.env.ADMIN_PANEL_PORT || 8083;

app.use(express.json());
app.use(express.static('public'));

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
});

// Get all questions
app.get('/api/questions', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM questions ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create question
app.post('/api/questions', async (req, res) => {
    try {
        const { text } = req.body;
        const result = await pool.query('INSERT INTO questions (text) VALUES ($1) RETURNING *', [text]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update question
app.put('/api/questions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const result = await pool.query('UPDATE questions SET text = $1 WHERE id = $2 RETURNING *', [text, id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete question
app.delete('/api/questions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM questions WHERE id = $1', [id]);
        res.sendStatus(204);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Admin Panel listening at http://localhost:${port}`);
});
