```markdown
# Backend User Stories - miniPOS API

## 🧱 Initial Project Setup

### Story 1: Project Foundation
**As a developer**, I want to initialize a NestJS project with TypeScript so that I have a clean and functional backend foundation.

**Acceptance Criteria:**
- [x] NestJS project created with CLI
- [x] TypeScript configuration properly set up
- [x] Project structure follows NestJS conventions
- [x] Basic health check endpoint available

### Story 2: Development Environment
**As a developer**, I want to set up Docker and Docker Compose to ensure consistent and portable development environments.

**Acceptance Criteria:**
- [x] Dockerfile for NestJS application
- [x] Docker Compose with API, PostgreSQL, and pgAdmin services
- [x] Environment variables properly configured
- [x] Hot reload working in development mode

### Story 3: Project Architecture
**As a developer**, I want to organize the project into clear folders (modules, controllers, services, entities, etc.) to maintain a modular and clean architecture.

**Acceptance Criteria:**
- [x] Modular structure with separate folders
- [x] Auth module for authentication
- [x] Users module for user management
- [x] Sales module for sales operations
- [x] Expenses module for expense operations
- [x] Common utilities and guards

### Story 4: Environment Configuration
**As a developer**, I want to create a `.env` file to store sensitive configuration values (like secrets and DB credentials), so that I can manage environments securely.

**Acceptance Criteria:**
- [x] `.env.example` file with all required variables
- [x] ConfigModule properly configured
- [x] Environment validation on startup
- [x] Different configurations for dev/prod environments

## 🔐 Authentication Stories

### Story 5: User Registration
**As a business owner**, I want to register for an account with my email and password so that I can access the miniPOS system.

**Acceptance Criteria:**
- [x] POST /auth/register endpoint
- [x] Email uniqueness validation
- [x] Password hashing with bcrypt
- [x] Input validation for email format and password strength
- [x] Proper error handling and responses

### Story 6: User Login
**As a registered user**, I want to log in with my credentials so that I can access my financial data.

**Acceptance Criteria:**
- [x] POST /auth/login endpoint
- [x] JWT token generation upon successful login
- [x] Password verification against hashed version
- [x] Token expiration handling
- [x] Proper error messages for invalid credentials

### Story 7: Route Protection
**As a system**, I want to protect sensitive endpoints so that only authenticated users can access their data.

**Acceptance Criteria:**
- [x] JWT Authentication Guard implemented
- [x] Protected routes require valid JWT token
- [x] Token validation middleware
- [x] Proper 401 responses for unauthorized requests
- [x] User context extraction from token

## 💰 Sales Management Stories

### Story 8: Create Sale
**As a business owner**, I want to record a sale through the API so that I can track my income.

**Acceptance Criteria:**
- [x] POST /sales endpoint
- [x] Validate required fields (amount)
- [x] Automatic date assignment if not provided
- [x] Associate sale with authenticated user
- [x] Return created sale with ID

### Story 9: Retrieve Sales
**As a business owner**, I want to get a list of my sales and individual sale details so that I can review my transactions.

**Acceptance Criteria:**
- [x] GET /sales endpoint returns user's sales
- [x] GET /sales/:id returns specific sale
- [x] Pagination support for sales list
- [x] Only return sales belonging to authenticated user
- [x] Proper 404 handling for non-existent sales

### Story 10: Update Sale
**As a business owner**, I want to update a sale record so that I can correct any mistakes.

**Acceptance Criteria:**
- [x] PUT /sales/:id endpoint
- [x] Validate ownership before allowing updates
- [x] Update only provided fields
- [x] Return updated sale data
- [x] Proper error handling

### Story 11: Delete Sale
**As a business owner**, I want to delete a sale record so that I can remove erroneous entries.

**Acceptance Criteria:**
- [x] DELETE /sales/:id endpoint
- [x] Validate ownership before deletion
- [x] Soft delete or hard delete implementation
- [x] Confirmation response
- [x] Proper error handling

## 💸 Expense Management Stories

### Story 12: Create Expense
**As a business owner**, I want to record an expense through the API so that I can track my spending.

**Acceptance Criteria:**
- [x] POST /expenses endpoint
- [x] Validate required fields (total amount)
- [x] Automatic date assignment if not provided
- [x] Associate expense with authenticated user
- [x] Return created expense with ID

### Story 13: Retrieve Expenses
**As a business owner**, I want to get a list of my expenses and individual expense details so that I can review my spending.

**Acceptance Criteria:**
- [x] GET /expenses endpoint returns user's expenses
- [x] GET /expenses/:id returns specific expense
- [x] Pagination support for expenses list
- [x] Only return expenses belonging to authenticated user
- [x] Proper 404 handling for non-existent expenses

### Story 14: Update Expense
**As a business owner**, I want to update an expense record so that I can correct any mistakes.

**Acceptance Criteria:**
- [x] PUT /expenses/:id endpoint
- [x] Validate ownership before allowing updates
- [x] Update only provided fields
- [x] Return updated expense data
- [x] Proper error handling

### Story 15: Delete Expense
**As a business owner**, I want to delete an expense record so that I can remove erroneous entries.

**Acceptance Criteria:**
- [x] DELETE /expenses/:id endpoint
- [x] Validate ownership before deletion
- [x] Soft delete or hard delete implementation
- [x] Confirmation response
- [x] Proper error handling

## 🔍 Data Filtering Stories

### Story 16: Filter by Date Range
**As a business owner**, I want to filter my sales and expenses by date range so that I can analyze specific periods.

**Acceptance Criteria:**
- [x] Query parameters `start_date` and `end_date` support
- [x] Date validation for proper format (YYYY-MM-DD)
- [x] Apply filters to both sales and expenses endpoints
- [x] Handle timezone considerations
- [x] Return filtered results with count

## 👤 User Information Stories

### Story 17: User Profile
**As a logged-in user**, I want to get my profile information including financial summary so that I can see my current status.

**Acceptance Criteria:**
- [x] GET /me endpoint
- [x] Return user basic information (id, email)
- [x] Include financial summary (total sales, expenses, balance)
- [x] Calculate totals from database
- [x] Proper authentication required

## 📊 Additional Technical Stories

### Story 18: API Documentation
**As a developer**, I want comprehensive API documentation so that I can integrate with the backend effectively.

**Acceptance Criteria:**
- [x] Swagger documentation available at /api
- [x] All endpoints documented with examples
- [x] DTO schemas included in documentation
- [x] Authentication requirements clearly marked
- [x] Error responses documented

### Story 19: Database Migrations
**As a developer**, I want database migrations so that I can version control database schema changes.

**Acceptance Criteria:**
- [x] TypeORM migrations configured
- [x] Initial migration for user, sales, and expenses tables
- [x] Migration scripts in package.json
- [x] Rollback capability for migrations
- [x] Seeding scripts for development data

### Story 20: Error Handling
**As a system**, I want consistent error handling so that API consumers receive meaningful error messages.

**Acceptance Criteria:**
- [x] Global exception filter implemented
- [x] Validation errors return 400 with details
- [x] Authentication errors return 401
- [x] Authorization errors return 403
- [x] Not found errors return 404
- [x] Server errors return 500 with safe messages