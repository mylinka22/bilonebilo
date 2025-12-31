import { Question } from '../types';
import { getTelegramUserId } from '../utils/admin';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Получить все вопросы
export async function fetchQuestions(): Promise<Question[]> {
  const response = await fetch(`${API_URL}/questions`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch questions');
  }
  
  return response.json();
}

// Создать новый вопрос
export async function createQuestion(text: string): Promise<Question> {
  const userId = getTelegramUserId();
  
  const response = await fetch(`${API_URL}/questions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-telegram-user-id': userId?.toString() || '',
    },
    body: JSON.stringify({ text }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create question');
  }
  
  return response.json();
}

// Обновить вопрос
export async function updateQuestion(id: string, text: string): Promise<Question> {
  const userId = getTelegramUserId();
  
  const response = await fetch(`${API_URL}/questions/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-telegram-user-id': userId?.toString() || '',
    },
    body: JSON.stringify({ text }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update question');
  }
  
  return response.json();
}

// Удалить вопрос
export async function deleteQuestion(id: string): Promise<void> {
  const userId = getTelegramUserId();
  
  const response = await fetch(`${API_URL}/questions/${id}`, {
    method: 'DELETE',
    headers: {
      'x-telegram-user-id': userId?.toString() || '',
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete question');
  }
}

