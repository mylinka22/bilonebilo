import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

// Получить все вопросы
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM questions ORDER BY created_at DESC'
    );
    res.json(result.rows || []);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Создать новый вопрос (только для админов)
router.post('/', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Question text is required' });
    }

    const result = await pool.query(
      'INSERT INTO questions (text) VALUES ($1) RETURNING *',
      [text.trim()]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'Failed to create question' });
  }
});

// Обновить вопрос (только для админов)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Question text is required' });
    }

    const result = await pool.query(
      'UPDATE questions SET text = $1 WHERE id = $2 RETURNING *',
      [text.trim(), id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ error: 'Failed to update question' });
  }
});

// Удалить вопрос (только для админов)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM questions WHERE id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ error: 'Failed to delete question' });
  }
});

export default router;

