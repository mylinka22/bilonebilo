#!/bin/bash

# Скрипт для создания .env файла на сервере

echo "🔧 Создание .env файла для сервера"
echo "===================================="
echo ""

# Проверка существования .env
if [ -f ".env" ]; then
    echo "⚠️  .env файл уже существует!"
    read -p "Перезаписать? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Отменено."
        exit 1
    fi
fi

# Создание .env файла
cat > .env << 'ENVEOF'
# Supabase Configuration
SUPABASE_URL=https://mwggrpnydjhdhvokswsy.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13Z2dycG55ZGpoZGh2b2tzd3N5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzE5MTgzMiwiZXhwIjoyMDgyNzY3ODMyfQ.mnt5oz9M57D26Q9Q7ie-sx4eWJlI6Vk0uKDODYQRj6s

# Backend Configuration
PORT=3000
ADMIN_TELEGRAM_IDS=123456789,987654321

# Frontend Configuration
# ⚠️ ВАЖНО: Замените YOUR_SERVER_IP на IP вашего сервера!
VITE_API_URL=http://YOUR_SERVER_IP:3000/api
VITE_ADMIN_TELEGRAM_IDS=123456789,987654321

# Ports Configuration
FRONTEND_PORT=8082
BACKEND_PORT=3000
ENVEOF

echo "✅ .env файл создан!"
echo ""
echo "⚠️  ВАЖНО: Отредактируйте .env файл и замените:"
echo "   1. YOUR_SERVER_IP на IP вашего сервера в VITE_API_URL"
echo "   2. ADMIN_TELEGRAM_IDS на ваш реальный Telegram ID"
echo "   3. VITE_ADMIN_TELEGRAM_IDS на ваш реальный Telegram ID"
echo ""
echo "Для редактирования:"
echo "   nano .env"
echo ""

