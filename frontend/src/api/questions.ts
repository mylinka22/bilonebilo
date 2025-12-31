import { Question } from '../types';
import { getTelegramUserId } from '../utils/admin';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Получить все вопросы
export async function fetchQuestions(): Promise<Question[]> {
  try {
    const response = await fetch(`${API_URL}/questions`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      throw new Error(`Failed to fetch questions: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('Network error:', error);
      throw new Error(`Не удалось подключиться к серверу. Проверьте VITE_API_URL: ${API_URL}`);
    }
    throw error;
  }
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

