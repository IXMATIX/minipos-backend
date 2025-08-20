# Backend Tech Stack - miniPOS API

## Language & Framework

### Core Technology
- **Language:** TypeScript
- **Web Framework:** NestJS

NestJS is a progressive Node.js framework for building efficient, reliable, and scalable server-side applications. It includes built-in support for modular architecture and dependency injection.

## 🔐 Authentication
- **Strategy:** NestJS built-in authentication with Passport.js strategies
- **Token Type:** JWT (JSON Web Tokens)
- **Supported Methods:** Local strategy (email/password)
- **Security:** bcrypt for password hashing

Following NestJS documentation recommendations for secure API authentication.

## 🗄️ Database

### Database Engine
- **Type:** Relational Database
- **Engine:** PostgreSQL
- **ORM:** TypeORM

Chosen for its robustness, scalability, and full compatibility with TypeORM, which provides a powerful ORM for managing entities, migrations, and database queries.

### Database Features
- Automatic migrations
- Entity relationships
- Query builder
- Connection pooling
- Transaction support

## 📊 API Documentation
- **Tool:** Swagger/OpenAPI
- **Auto-generation:** Decorators-based documentation
- **Interactive UI:** Available at `/api` endpoint

## 🐳 Containerization
- **Docker:** Multi-stage builds for development and production
- **Docker Compose:** Development environment with PostgreSQL and pgAdmin
- **Services:**
  - API service (NestJS application)
  - Database service (PostgreSQL)
  - Database Admin (pgAdmin)

## 🛠️ Development Tools

### Code Quality
- **Linting:** ESLint with TypeScript rules
- **Formatting:** Prettier
- **Type Checking:** TypeScript strict mode
- **Testing:** Jest for unit and integration tests

### Environment Management
- **Configuration:** @nestjs/config with .env files
- **Validation:** Class-validator for DTO validation
- **Transformation:** Class-transformer for data serialization

## 📦 Key Dependencies

```json
{
  "@nestjs/core": "^10.0.0",
  "@nestjs/common": "^10.0.0",
  "@nestjs/typeorm": "^10.0.0",
  "@nestjs/jwt": "^10.0.0",
  "@nestjs/passport": "^10.0.0",
  "@nestjs/swagger": "^7.0.0",
  "typeorm": "^0.3.0",
  "pg": "^8.11.0",
  "bcrypt": "^5.1.0",
  "class-validator": "^0.14.0",
  "class-transformer": "^0.5.0"
}