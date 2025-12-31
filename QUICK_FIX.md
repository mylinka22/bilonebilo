# ⚡ Быстрое решение "Load failed"

## Проблема
Frontend не может подключиться к backend API.

## Решение на сервере

### Вариант 1: Использовать имя сервиса Docker (рекомендуется)

```bash
cd ~/bilonebilo

# Обновите код
git pull

# В .env установите (или оставьте по умолчанию):
# VITE_API_URL=http://backend:3000/api

# Пересоберите frontend
docker compose build --no-cache frontend
docker compose up -d
```

### Вариант 2: Использовать IP сервера

```bash
# 1. Узнайте IP сервера
hostname -I | awk '{print $1}'
# или
curl ifconfig.me

# 2. Отредактируйте .env
nano .env

# 3. Установите (замените YOUR_SERVER_IP):
VITE_API_URL=http://YOUR_SERVER_IP:3000/api

# 4. Пересоберите frontend
docker compose build --no-cache frontend
docker compose up -d frontend
```

## Проверка

```bash
# Проверьте логи
docker compose logs frontend | tail -20
docker compose logs backend | tail -20

# Проверьте backend
curl http://localhost:3000/health
curl http://localhost:3000/api/questions
```

## После исправления

Откройте сайт в браузере - ошибка "Load failed" должна исчезнуть.

