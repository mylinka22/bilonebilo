import { useState, useEffect } from 'react';
import Card from '../components/Card';
import GameControls from '../components/GameControls';
import { fetchQuestions } from '../api/questions';
import { shuffle } from '../utils/shuffle';
import { Question } from '../types';
import { isAdmin } from '../utils/admin';
import './Game.css';

interface GameProps {
  onAdminClick?: () => void;
}

export default function Game({ onAdminClick }: GameProps) {
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
      const data = await fetchQuestions();
      setAllQuestions(data);
      // Инициализируем доступные вопросы (перемешанные)
      setAvailableQuestions(shuffle([...data]));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки вопросов');
      console.error('Failed to load questions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrawCard = () => {
    if (availableQuestions.length === 0) {
      // Вопросы закончились
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
    
    // Если карта уже есть, сначала переворачиваем обратно
    if (currentQuestion) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentQuestion(selectedQuestion);
        setTimeout(() => {
          setIsFlipped(true);
        }, 50);
      }, 300);
    } else {
      // Если карты нет, сразу показываем новую
      setCurrentQuestion(selectedQuestion);
      setIsFlipped(false);
      setTimeout(() => {
        setIsFlipped(true);
      }, 100);
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
        <div className="loading">Загрузка вопросов...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="game-container">
        <div className="error">
          <p>Ошибка: {error}</p>
          <button onClick={loadQuestions} className="retry-button">
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
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
        ) : (
          <>
            {currentQuestion ? (
              <Card key={currentQuestion.id} text={currentQuestion.text} isFlipped={isFlipped} />
            ) : (
              <div className="card-placeholder">
                <p>Нажмите "Вытянуть карту" чтобы начать</p>
              </div>
            )}
          </>
        )}
      </div>

      <GameControls
        onDrawCard={handleDrawCard}
        onAdminClick={onAdminClick}
        isAdmin={isAdmin()}
        availableCount={availableQuestions.length}
        onReset={availableQuestions.length === 0 ? handleResetSession : undefined}
      />
    </div>
  );
}

