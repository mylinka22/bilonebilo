import './GameControls.css';

interface GameControlsProps {
  onDrawCard: () => void;
  onAdminClick?: () => void;
  isAdmin?: boolean;
  availableCount?: number;
  onReset?: () => void;
}

export default function GameControls({ 
  onDrawCard, 
  onAdminClick, 
  isAdmin,
  availableCount = 0,
  onReset
}: GameControlsProps) {
  const hasQuestions = availableCount > 0;

  return (
    <div className="game-controls">
      {hasQuestions ? (
        <>
          <button className="draw-card-button" onClick={onDrawCard}>
            <span className="button-text">Вытянуть карту</span>
            <span className="button-icon">🎴</span>
          </button>
          {availableCount > 0 && (
            <div className="questions-counter">
              <span className="counter-icon">📚</span>
              <span className="counter-text">Осталось карт:</span>
              <span className="counter-number">{availableCount}</span>
            </div>
          )}
        </>
      ) : onReset ? (
        <button className="reset-session-button" onClick={onReset}>
          <span className="button-text">Начать заново</span>
          <span className="button-icon">🔄</span>
        </button>
      ) : null}
      
      {isAdmin && onAdminClick && (
        <button className="admin-button" onClick={onAdminClick}>
          ⚙️ Админ-панель
        </button>
      )}
    </div>
  );
}

