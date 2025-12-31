// Проверка, является ли пользователь администратором
export function isAdmin(): boolean {
  if (!window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
    return false;
  }

  const userId = window.Telegram.WebApp.initDataUnsafe.user.id.toString();
  
  // Список ID администраторов (в продакшене должен приходить с бэкенда или из env)
  // Для разработки можно добавить свой ID
  const adminIds = import.meta.env.VITE_ADMIN_TELEGRAM_IDS?.split(',').map((id: string) => id.trim()) || [];
  
  return adminIds.includes(userId);
}

// Получение Telegram ID пользователя
export function getTelegramUserId(): number | null {
  return window.Telegram?.WebApp?.initDataUnsafe?.user?.id || null;
}

