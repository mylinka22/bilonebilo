# 🔧 Решение проблемы "Load failed"

## Диагностика проблемы

### 1. Проверьте логи контейнеров

```bash
# Логи backend
docker compose logs backend

# Логи frontend
docker compose logs frontend

# Все логи
docker compose logs
```

### 2. Проверьте доступность backend

```bash
# С сервера
curl http://localhost:3000/health
curl http://localhost:3000/api/questions

# С внешнего IP (если порт открыт)
curl http://YOUR_SERVER_IP:3000/health
```

### 3. Проверьте .env файл

```bash
cat .env
```

**Важно:** `VITE_API_URL` должен указывать на доступный адрес backend:

```env
# Если backend доступен публично
VITE_API_URL=http://YOUR_SERVER_IP:3000/api

# Или если используете домен
VITE_API_URL=http://api.yourdomain.com/api

# НЕ используйте localhost в продакшене!
# VITE_API_URL=http://localhost:3000/api  ❌
```

### 4. Проверьте, что backend доступен из frontend контейнера

```bash
# Войдите в frontend контейнер
docker compose exec frontend sh

# Проверьте доступность backend
wget -O- http://backend:3000/health
# или
curl http://backend:3000/health
```

## Решения

### Решение 1: Исправить VITE_API_URL

1. Узнайте IP вашего сервера:
   ```bash
   hostname -I | awk '{print $1}'
   # или
   curl ifconfig.me
   ```

2. Отредактируйте `.env`:
   ```bash
   nano .env
   ```

3. Установите правильный `VITE_API_URL`:
   ```env
   VITE_API_URL=http://YOUR_SERVER_IP:3000/api
   ```

4. Пересоберите frontend:
   ```bash
   docker compose build --no-cache frontend
   docker compose up -d frontend
   ```

### Решение 2: Использовать внутреннее имя сервиса Docker

Если frontend и backend в одной Docker сети, можно использовать имя сервиса:

1. Измените `.env`:
   ```env
   VITE_API_URL=http://backend:3000/api
   ```

2. Пересоберите frontend:
   ```bash
   docker compose build --no-cache frontend
   docker compose up -d
   ```

### Решение 3: Проверить CORS настройки

Backend уже настроен с `app.use(cors())`, что должно разрешать запросы от любого источника.

Если проблема остается, можно явно указать origin:

```typescript
// В server/index.ts
app.use(cors({
  origin: '*', // или конкретный домен
  credentials: true
}));
```

### Решение 4: Проверить сеть Docker

```bash
# Проверьте, что контейнеры в одной сети
docker compose ps
docker network inspect bilonebilo_bilonebilo-network
```

### Решение 5: Проверить порты

```bash
# Проверьте, что порты открыты
sudo netstat -tulpn | grep -E '3000|8082'

# Или
sudo ss -tulpn | grep -E '3000|8082'
```

## Быстрая проверка

Выполните на сервере:

```bash
# 1. Проверьте статус контейнеров
docker compose ps

# 2. Проверьте логи
docker compose logs backend | tail -20
docker compose logs frontend | tail -20

# 3. Проверьте backend
curl http://localhost:3000/health
curl http://localhost:3000/api/questions

# 4. Проверьте .env
grep VITE_API_URL .env

# 5. Проверьте доступность снаружи (если порт открыт)
curl http://$(hostname -I | awk '{print $1}'):3000/health
```

## Частые проблемы

### Проблема: VITE_API_URL указывает на localhost

**Решение:** Замените на IP сервера или домен

### Проблема: Backend не запускается

**Решение:** Проверьте логи и .env файл (Supabase настройки)

### Проблема: CORS ошибка в браузере

**Решение:** Backend уже настроен с CORS, но проверьте логи backend

### Проблема: Порт 3000 не доступен снаружи

**Решение:** 
- Откройте порт в firewall: `sudo ufw allow 3000/tcp`
- Или используйте reverse proxy (nginx)

## После исправления

После изменения `.env` и пересборки frontend:

```bash
docker compose down
docker compose build --no-cache frontend
docker compose up -d
```

Проверьте в браузере - ошибка должна исчезнуть.

