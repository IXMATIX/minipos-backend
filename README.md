# 📦 MiniPOS API


<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" alt="NestJS Logo" width="120"/>
</p>

REST API built with **NestJS**, **TypeORM**, and **PostgreSQL**, documented with **Swagger**, and containerized with **Docker**.  
The project is designed to be scalable, with database migrations and database administration tools.

---

## ⚙️ Setup

### 1️⃣ Clone the repository
```bash
git clone org-41710699@github.com:IXMATIX/minipos-backend.git
cd minipos-api
```
---

### 2️⃣ Configure environment variables

Copy the example file and adjust your values:

```bash
cp .env.example .env
```
---

### 3️⃣ Run with Docker

```bash
docker-compose up --build
```

---

###  🗄️ Database Migrations
```bash
npm run migration:generate --name=createUserTable
```

Run migrations
```bash
npm run migration:run
```
---

### 📖 API Documentation
The API is fully documented with Swagger:
```bash
👉 http://localhost:3001/api
```

### 🧪 Useful Scripts
```bash
npm run start:dev          # Run in development mode
npm run build              # Build the project
npm run migration:generate # Generate a new migration
npm run migration:run      # Run migrations
npm run migration:revert   # Revert the last migration
npm run test               # Run tests
```
