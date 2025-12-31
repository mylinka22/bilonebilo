#!/bin/bash

echo "🔍 Диагностика проблемы загрузки"
echo "================================"
echo ""

echo "1. Проверка статуса контейнеров:"
docker compose ps
echo ""

echo "2. Проверка backend health (localhost):"
curl -v http://localhost:3000/health 2>&1 | head -20
echo ""

echo "3. Проверка backend health (по IP):"
curl -v http://95.31.42.147:3000/health 2>&1 | head -20
echo ""

echo "4. Проверка API (localhost):"
curl -v http://localhost:3000/api/questions 2>&1 | head -30
echo ""

echo "5. Проверка API (по IP):"
curl -v http://95.31.42.147:3000/api/questions 2>&1 | head -30
echo ""

echo "6. Проверка портов:"
sudo netstat -tulpn | grep -E '3000|8082' || ss -tulpn | grep -E '3000|8082'
echo ""

echo "7. Логи backend (последние 20 строк):"
docker compose logs --tail=20 backend
echo ""

echo "8. Логи frontend (последние 20 строк):"
docker compose logs --tail=20 frontend
echo ""

echo "9. Проверка CORS заголовков:"
curl -v -H "Origin: http://95.31.42.147:8082" http://95.31.42.147:3000/api/questions 2>&1 | grep -i "access-control"
echo ""

echo "10. Проверка firewall:"
sudo ufw status | grep -E '3000|8082' || echo "UFW не активен или порты не настроены"
echo ""

