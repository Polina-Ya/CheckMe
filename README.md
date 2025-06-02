# CheckMe

CheckMe — это финтех-приложение для контроля регулярных подписок, анализа трат и геймифицированной экономии средств.

## 📁 Структура проекта
```
checkme/
├── client/         # React + Tailwind frontend
│   ├── package.json
│   └── src/App.jsx
├── server/         # Node.js backend (Express + MongoDB + JWT)
│   ├── index.js
│   └── .env.example
├── .gitignore
├── .vercel.json
└── README.md
```

---

## 🚀 Быстрый старт (локально)

### 🔧 1. Клонировать и перейти в папку проекта
```bash
git clone https://github.com/your-username/checkme.git
cd checkme
```

### ▶️ 2. Запустить backend
```bash
cd server
cp .env.example .env
npm install
node index.js
```

**`.env` должен содержать:**
```
PORT=4000
MONGO_URI=mongodb+srv://<login>:<pass>@cluster.mongodb.net/checkme
JWT_SECRET=your_secret_key
```

### 💻 3. Запустить frontend
```bash
cd ../client
npm install
npm start
```

Frontend будет доступен по адресу [http://localhost:3000](http://localhost:3000)

---

## ☁️ Деплой

### 🟩 Vercel (frontend)
1. Перейти на [vercel.com](https://vercel.com)
2. Импортировать `client/` из GitHub
3. Установить `Build Command`: `npm run build`
4. Установить `Output Directory`: `build`

### 🟪 Render (backend)
1. Перейти на [render.com](https://render.com)
2. Создать Web Service из папки `server/`
3. Build command: `npm install`
4. Start command: `node index.js`
5. Добавить переменные `.env`

---

## 🔑 Авторизация (JWT)

POST `/api/register`
```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

POST `/api/login` → возвращает `token`

Используй токен в `Authorization: Bearer TOKEN` для доступа к API:
- `/api/subscriptions`
- `/api/achievements`

---

## 📦 Библиотеки
- **Frontend**: React, Axios, Recharts, Tailwind CSS
- **Backend**: Express, Mongoose, JWT, bcryptjs, dotenv

---

## 📞 Поддержка
Если что-то не работает — создайте [Issue](https://github.com/your-username/checkme/issues) или напишите в Telegram: `@your_username`
