import { useEffect, useState } from 'react';
import Game from './pages/Game';
import Admin from './pages/Admin';
import { isAdmin } from './utils/admin';

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        initDataUnsafe: {
          user?: {
            id: number;
          };
        };
        colorScheme: 'light' | 'dark';
      };
    };
  }
}

function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Инициализация Telegram WebApp
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();

      setIsInitialized(true);

      // Применение темы Telegram
      const colorScheme = window.Telegram.WebApp.colorScheme || 'light';
      document.documentElement.setAttribute('data-theme', colorScheme);
    } else {
      // Для разработки без Telegram
      setIsInitialized(true);
      console.warn('Telegram WebApp API not available. Running in development mode.');
    }
  }, []);

  if (!isInitialized) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: '24px'
      }}>
        <div style={{
          position: 'relative',
          width: '80px',
          height: '80px'
        }}>
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            border: '4px solid transparent',
            borderTopColor: '#a78bfa',
            borderRadius: '50%',
            animation: 'spin 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite'
          }}></div>
        </div>
        <p style={{
          fontSize: '18px',
          fontWeight: 600,
          color: '#a78bfa'
        }}>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="app" style={{ position: 'relative', overflow: 'hidden' }}>
      <Game />
    </div>
  );
}

export default App;

