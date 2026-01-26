import { useState, useEffect } from 'react';
import Card from '../components/Card';
import GameControls from '../components/GameControls';
import { fetchQuestions } from '../api/questions';
import { shuffle } from '../utils/shuffle';
import { Question } from '../types';
import './Game.css';

export default function Game() {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка вопросов при монтировании
  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Добавляем таймаут для запроса
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 секунд

      const data = await fetchQuestions();
      clearTimeout(timeoutId);

      setAllQuestions(data);
      // Инициализируем доступные вопросы (перемешанные)
      setAvailableQuestions(shuffle([...data]));
    } catch (err) {
      let errorMessage = 'Ошибка загрузки вопросов';

      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = 'Превышено время ожидания. Проверьте доступность сервера.';
        } else if (err.message.includes('fetch') || err.message.includes('Failed to fetch')) {
          errorMessage = 'Не удалось подключиться к серверу. Проверьте, что backend запущен и доступен.';
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
      console.error('Failed to load questions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrawCard = () => {
    if (availableQuestions.length === 0) {
      return;
    }

    // Выбираем случайный вопрос из доступных
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const selectedQuestion = availableQuestions[randomIndex];

    // Удаляем выбранный вопрос из доступных
    const newAvailable = availableQuestions.filter(
      (q) => q.id !== selectedQuestion.id
    );
    setAvailableQuestions(newAvailable);

    if (currentQuestion) {
      // Переворачиваем карту обратно
      setIsFlipped(false);
      // Ждем завершения анимации переворота (600ms), меняем текст
      setTimeout(() => {
        setCurrentQuestion(selectedQuestion);
        // Переворачиваем карту с новым текстом
        setTimeout(() => {
          setIsFlipped(true);
        }, 50);
      }, 600);
    } else {
      // Первая карта
      setCurrentQuestion(selectedQuestion);
      setTimeout(() => {
        setIsFlipped(true);
      }, 50);
    }
  };

  const handleResetSession = () => {
    // Сбрасываем сессию: перемешиваем все вопросы заново
    setAvailableQuestions(shuffle([...allQuestions]));
    setCurrentQuestion(null);
    setIsFlipped(false);
  };

  if (isLoading) {
    return (
      <div className="game-container">
        <div className="loading">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          <p className="loading-text">Загрузка вопросов...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="game-container">
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
    <div className="game-container">
      <div className="background-decoration">
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
        <div className="decoration-circle circle-3"></div>
      </div>

      <div className="game-header">
        <h1>Было / Не было</h1>
        <p className="subtitle">Вытяните карту и узнайте, что было у других</p>
      </div>

      <div className="card-section">
        {availableQuestions.length === 0 ? (
          <div className="no-questions-message">
            <p className="no-questions-title">Вопросы закончились</p>
            <p className="no-questions-subtitle">Все карты из колоды уже вытянуты</p>
            <button onClick={handleResetSession} className="reset-button">
              Начать заново
            </button>
          </div>
        ) : currentQuestion ? (
          <Card text={currentQuestion.text} isFlipped={isFlipped} />
        ) : (
          <div className="card-placeholder">
            <p>Нажмите "Вытянуть карту" чтобы начать</p>
          </div>
        )}
      </div>

      <GameControls
        onDrawCard={handleDrawCard}
        availableCount={availableQuestions.length}
        onReset={availableQuestions.length === 0 ? handleResetSession : undefined}
      />
    </div>
  );
}

