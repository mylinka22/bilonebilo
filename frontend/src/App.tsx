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
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Инициализация Telegram WebApp
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();

      // Проверка прав администратора
      const admin = isAdmin();
      setIsAdminMode(admin);
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
    return <div>Загрузка...</div>;
  }

  return (
    <div className="app">
      {isAdminMode ? (
        <Admin onBackToGame={() => setIsAdminMode(false)} />
      ) : (
        <Game onAdminClick={isAdmin() ? () => setIsAdminMode(true) : undefined} />
      )}
    </div>
  );
}

export default App;

