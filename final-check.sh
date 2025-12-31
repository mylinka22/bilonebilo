#!/bin/bash

echo "✅ Порты открыты в firewall!"
echo "=============================="
echo ""

echo "1. Проверка backend по IP:"
curl -s http://95.31.42.147:3000/health && echo "" || echo "❌ Backend недоступен"
echo ""

echo "2. Проверка API по IP:"
curl -s http://95.31.42.147:3000/api/questions | head -c 200 && echo "..." || echo "❌ API недоступен"
echo ""

echo "3. Если backend доступен, нужно:"
echo "   - Обновить код: git pull"
echo "   - Пересобрать frontend: docker compose build --no-cache frontend"
echo "   - Перезапустить: docker compose up -d frontend"
echo ""

