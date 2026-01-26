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

// Test connection on startup
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Admin Panel failed to connect to DB:', err.message);
    } else {
        console.log('✅ Admin Panel successfully connected to PostgreSQL');
    }
});

// Get all questions
app.get('/api/questions', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM questions ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch questions: ' + err.message });
    }
});

// Create question
app.post('/api/questions', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || text.trim() === '') {
            return res.status(400).json({ error: 'Text is required' });
        }
        const result = await pool.query('INSERT INTO questions (text) VALUES ($1) RETURNING *', [text.trim()]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Create error:', err);
        res.status(500).json({ error: 'Failed to create: ' + err.message });
    }
});

// Update question
app.put('/api/questions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        if (!text || text.trim() === '') {
            return res.status(400).json({ error: 'Text is required' });
        }
        const result = await pool.query('UPDATE questions SET text = $1 WHERE id = $2 RETURNING *', [text.trim(), id]);
        if (result.rowCount === 0) return res.status(404).json({ error: 'Not found' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Update error:', err);
        res.status(500).json({ error: 'Failed to update: ' + err.message });
    }
});

// Delete question
app.delete('/api/questions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM questions WHERE id = $1', [id]);
        if (result.rowCount === 0) return res.status(404).json({ error: 'Not found' });
        res.sendStatus(204);
    } catch (err) {
        console.error('Delete error:', err);
        res.status(500).json({ error: 'Failed to delete: ' + err.message });
    }
});

app.listen(port, () => {
    console.log(`Admin Panel listening at http://localhost:${port}`);
});
