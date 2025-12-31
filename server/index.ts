import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import questionsRouter from './routes/questions.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware для проверки Telegram ID администратора
const checkAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const telegramId = req.headers['x-telegram-user-id'] as string;
  
  if (!telegramId) {
    return res.status(401).json({ error: 'Telegram user ID is required' });
  }

  const adminIds = process.env.ADMIN_TELEGRAM_IDS?.split(',').map(id => id.trim()) || [];
  
  if (!adminIds.includes(telegramId)) {
    return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }

  next();
};

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Условный middleware для проверки админа только для POST, PUT, DELETE
const conditionalAdminCheck = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const method = req.method;
  if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
    return checkAdmin(req, res, next);
  }
  next();
};

// Все маршруты /api/questions
// GET - публичный, POST/PUT/DELETE - требуют админ-прав
app.use('/api/questions', conditionalAdminCheck, questionsRouter);

// Обработка ошибок
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://0.0.0.0:${PORT}/api`);
});

