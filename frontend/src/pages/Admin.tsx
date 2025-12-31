import { useState, useEffect } from 'react';
import QuestionEditor from '../components/QuestionEditor';
import { fetchQuestions } from '../api/questions';
import { Question } from '../types';
import './Admin.css';

interface AdminProps {
  onBackToGame: () => void;
}

export default function Admin({ onBackToGame }: AdminProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchQuestions();
      setQuestions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки вопросов');
      console.error('Failed to load questions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-container">
        <div className="loading">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          <p className="loading-text">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-container">
        <div className="error">
          <div className="error-icon">⚠️</div>
          <p className="error-message">Ошибка: {error}</p>
          <button onClick={loadQuestions} className="retry-button">
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <button onClick={onBackToGame} className="back-button">
          ← Назад в игру
        </button>
        <h1>Админ-панель</h1>
      </div>
      <QuestionEditor questions={questions} onUpdate={loadQuestions} />
    </div>
  );
}

