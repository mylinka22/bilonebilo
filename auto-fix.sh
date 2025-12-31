#!/bin/bash

echo "🔧 Автоматическое исправление проблем"
echo "====================================="
echo ""

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Добавление пользователя в группу docker
echo "1. Добавление пользователя в группу docker..."
if groups | grep -q docker; then
    echo -e "${GREEN}✅ Пользователь уже в группе docker${NC}"
else
    echo -e "${YELLOW}⚠️  Добавляю пользователя в группу docker...${NC}"
    sudo usermod -aG docker $USER
    echo -e "${GREEN}✅ Пользователь добавлен. Выполните 'newgrp docker' или перелогиньтесь${NC}"
fi
echo ""

# 2. Проверка и открытие портов
echo "2. Проверка firewall..."
if sudo ufw status | grep -q "3000/tcp.*ALLOW"; then
    echo -e "${GREEN}✅ Порт 3000 уже открыт${NC}"
else
    echo -e "${YELLOW}⚠️  Открываю порт 3000...${NC}"
    sudo ufw allow 3000/tcp
    echo -e "${GREEN}✅ Порт 3000 открыт${NC}"
fi

if sudo ufw status | grep -q "8082/tcp.*ALLOW"; then
    echo -e "${GREEN}✅ Порт 8082 уже открыт${NC}"
else
    echo -e "${YELLOW}⚠️  Открываю порт 8082...${NC}"
    sudo ufw allow 8082/tcp
    echo -e "${GREEN}✅ Порт 8082 открыт${NC}"
fi
echo ""

# 3. Обновление .env файла
echo "3. Проверка .env файла..."
if [ -f .env ]; then
    if grep -q "VITE_API_URL=http://95.31.42.147:3000/api" .env; then
        echo -e "${GREEN}✅ VITE_API_URL уже настроен правильно${NC}"
    else
        echo -e "${YELLOW}⚠️  Обновляю VITE_API_URL...${NC}"
        sed -i 's|VITE_API_URL=.*|VITE_API_URL=http://95.31.42.147:3000/api|' .env
        echo -e "${GREEN}✅ VITE_API_URL обновлен${NC}"
    fi
else
    echo -e "${RED}❌ .env файл не найден!${NC}"
    exit 1
fi
echo ""

# 4. Проверка доступности backend
echo "4. Проверка доступности backend..."
if curl -s --max-time 5 http://95.31.42.147:3000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend доступен по IP${NC}"
else
    echo -e "${YELLOW}⚠️  Backend недоступен по IP, проверяю localhost...${NC}"
    if curl -s --max-time 5 http://localhost:3000/health > /dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Backend работает на localhost, но не доступен по IP${NC}"
        echo -e "${YELLOW}   Возможно, нужно перезапустить контейнеры${NC}"
    else
        echo -e "${RED}❌ Backend не работает!${NC}"
    fi
fi
echo ""

# 5. Обновление кода
echo "5. Обновление кода из GitHub..."
git pull
echo ""

# 6. Пересборка frontend
echo "6. Пересборка frontend..."
echo -e "${YELLOW}⏳ Это может занять несколько минут...${NC}"
docker compose build --no-cache frontend
echo ""

# 7. Перезапуск
echo "7. Перезапуск контейнеров..."
docker compose up -d
echo ""

# 8. Финальная проверка
echo "8. Финальная проверка..."
sleep 5

echo "Проверка backend:"
if curl -s http://95.31.42.147:3000/health | grep -q "ok"; then
    echo -e "${GREEN}✅ Backend работает${NC}"
else
    echo -e "${RED}❌ Backend не отвечает${NC}"
fi

echo ""
echo "Проверка API:"
if curl -s http://95.31.42.147:3000/api/questions | grep -q "id"; then
    echo -e "${GREEN}✅ API работает${NC}"
else
    echo -e "${RED}❌ API не работает${NC}"
fi

echo ""
echo "Проверка frontend:"
if curl -s http://95.31.42.147:8082 | grep -q "html"; then
    echo -e "${GREEN}✅ Frontend работает${NC}"
else
    echo -e "${RED}❌ Frontend не работает${NC}"
fi

echo ""
echo "=============================="
echo -e "${GREEN}✅ Настройка завершена!${NC}"
echo ""
echo "Сайт должен быть доступен по адресу:"
echo "http://95.31.42.147:8082"
echo ""
echo "Если проблемы остались, проверьте логи:"
echo "docker compose logs backend"
echo "docker compose logs frontend"

