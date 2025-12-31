#!/bin/bash

echo "🔍 Диагностика сервера"
echo "===================="
echo ""

echo "1. Проверка контейнеров:"
docker compose ps
echo ""

echo "2. Проверка backend health:"
curl -s http://localhost:3000/health || echo "❌ Backend не отвечает"
echo ""

echo "3. Проверка API:"
curl -s http://localhost:3000/api/questions | head -c 200 || echo "❌ API не работает"
echo ""

echo "4. Проверка .env:"
grep VITE_API_URL .env
echo ""

echo "5. Проверка доступности backend из frontend контейнера:"
docker compose exec frontend wget -q -O- http://backend:3000/health 2>/dev/null && echo "✅ Backend доступен" || echo "❌ Backend недоступен из frontend"
echo ""

echo "6. Логи backend (последние 10 строк):"
docker compose logs --tail=10 backend
echo ""

echo "7. Логи frontend (последние 10 строк):"
docker compose logs --tail=10 frontend
