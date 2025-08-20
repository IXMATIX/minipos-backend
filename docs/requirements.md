# miniPOS Backend - Requirements

## Project Overview

miniPOS is a web app designed for small businesses that need to keep basic control of their daily sales and expenses, and quickly visualize their profits.

## Objective

Develop a functional MVP backend that provides:
- User registration and login with secure authentication
- API endpoints for recording sales and expenses
- Data persistence with PostgreSQL
- RESTful API design with proper validation
- Secure session management with JWT tokens

## MVP Scope

### Authentication Module
- User registration with email and password
- Secure login with JWT token generation
- Protected routes requiring authentication
- Session management and token validation

### Financial Module
**Sales Management:**
- Create sale records with: total amount, date, description (optional)
- Retrieve individual sale by ID
- List all sales for authenticated user
- Update existing sale records
- Delete sale records

**Expenses Management:**
- Create expense records with: total amount, date, description (optional)
- Retrieve individual expense by ID
- List all expenses for authenticated user
- Update existing expense records
- Delete expense records

### Data Filtering
- Filter sales and expenses by date range
- Support for query parameters in list endpoints

## Expected Outcome

A robust backend API with:
- Secure user authentication system
- Complete CRUD operations for financial transactions
- Data validation and error handling
- Clean, modular code architecture
- Database migrations and seeding
- API documentation with Swagger
- Docker containerization for development