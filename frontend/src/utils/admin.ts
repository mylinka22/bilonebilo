// Проверка, является ли пользователь администратором
export function isAdmin(): boolean {
  return false; // В игре админ-панель больше не нужна, используйте отдельную панель на порту 8083
}

// Получение Telegram ID пользователя
export function getTelegramUserId(): number | null {
  return window.Telegram?.WebApp?.initDataUnsafe?.user?.id || null;
}

