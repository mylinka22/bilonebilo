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
            Вытянуть карту
          </button>
          {availableCount > 0 && (
            <div className="questions-counter">
              Осталось карт: {availableCount}
            </div>
          )}
        </>
      ) : onReset ? (
        <button className="reset-session-button" onClick={onReset}>
          🔄 Начать заново
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

