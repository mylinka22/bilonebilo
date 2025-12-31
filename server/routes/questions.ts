import express from 'express';
import { supabase } from '../supabase.js';

const router = express.Router();

// Получить все вопросы
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching questions:', error);
      return res.status(500).json({ error: 'Failed to fetch questions' });
    }

    res.json(data || []);
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Создать новый вопрос (только для админов)
router.post('/', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Question text is required' });
    }

    const { data, error } = await supabase
      .from('questions')
      .insert([{ text: text.trim() }])
      .select()
      .single();

    if (error) {
      console.error('Error creating question:', error);
      return res.status(500).json({ error: 'Failed to create question' });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
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

    const { data, error } = await supabase
      .from('questions')
      .update({ text: text.trim() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating question:', error);
      return res.status(500).json({ error: 'Failed to update question' });
    }

    if (!data) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Удалить вопрос (только для админов)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting question:', error);
      return res.status(500).json({ error: 'Failed to delete question' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

