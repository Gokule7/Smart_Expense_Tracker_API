# Smart Expense Tracker API

A lightweight, robust, and clean RESTful API built with **Node.js** and **Express**. The application stores expense records locally in a JSON file without requiring any external database setup, making it easy to run and test immediately.

---

## Tech Stack & Architecture

- **Runtime Environment:** Node.js (v16+)
- **Web Framework:** Express.js v4
- **Storage:** Local JSON file persistence (`data/expenses.json`) using Node's `fs/promises` module
- **API Documentation:** Swagger UI (`swagger-ui-express`)
- **Testing Framework:** Jest & Supertest

### Project Structure
```text
your-repo/
  src/
    app.js           # Express app initialization, middleware, and OpenAPI configuration
    server.js        # Entry point for running the server & file initialization
    routes.js        # Endpoint routing definition
    controller.js    # Business logic for expense operations & calculation
    storage.js       # Asynchronous file I/O operations for data/expenses.json
  data/
    expenses.json    # Initial JSON array storage file
  tests/
    expense.test.js  # Automated unit & integration tests using Jest and Supertest
  package.json       # Project dependencies & npm scripts
```

---

## Getting Started

Follow these steps to set up and run the project on a clean machine:

### 1. Prerequisites
Ensure **Node.js** (v16.x or later) and **npm** are installed on your machine:
```bash
node -v
npm -v
```

### 2. Installation
Clone the repository and install the project dependencies:
```bash
npm install
```

### 3. Running the Server
Start the Express server locally:
```bash
npm start
```
The server will run at `http://localhost:3000`.

---

##  Running Automated Tests

Run the complete test suite powered by Jest and Supertest:
```bash
npm test
```
This runs tests sequentially in a clean sandbox environment without polluting the storage file.

---

##  Interactive API Documentation (Swagger UI)

Once the server is running, open your web browser and navigate to:
```text
http://localhost:3000/api/docs
```
You can inspect schemas and test endpoints directly through the interactive Swagger UI.

---

##  Manual Verification Guide

Below are exact `cURL` commands to manually test every single endpoint using your terminal or API clients like Postman.

### 1. Add a New Expense (POST)
```bash
curl -X POST http://localhost:3000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Groceries",
    "amount": 45.50,
    "category": "Food",
    "date": "2026-08-01"
  }'
```
*Expected Response (201 Created):*
```json
{
  "id": "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
  "title": "Groceries",
  "amount": 45.5,
  "category": "Food",
  "date": "2026-08-01T00:00:00.000Z"
}
```

Add a second expense for testing filtering and total calculations:
```bash
curl -X POST http://localhost:3000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Bus Pass",
    "amount": 25.00,
    "category": "Transport",
    "date": "2026-08-01"
  }'
```

---

### 2. View All Expenses (GET)
```bash
curl -X GET http://localhost:3000/api/expenses
```
*Expected Response (200 OK):*
```json
[
  {
    "id": "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
    "title": "Groceries",
    "amount": 45.5,
    "category": "Food",
    "date": "2026-08-01T00:00:00.000Z"
  },
  {
    "id": "2c9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bee",
    "title": "Bus Pass",
    "amount": 25,
    "category": "Transport",
    "date": "2026-08-01T00:00:00.000Z"
  }
]
```

---

### 3. Filter Expenses by Category (GET)
```bash
curl -X GET "http://localhost:3000/api/expenses/filter?category=Food"
```
*Expected Response (200 OK):*
```json
[
  {
    "id": "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
    "title": "Groceries",
    "amount": 45.5,
    "category": "Food",
    "date": "2026-08-01T00:00:00.000Z"
  }
]
```

---

### 4. Calculate Total Expenses (GET)

#### Overall Total:
```bash
curl -X GET http://localhost:3000/api/expenses/total
```
*Expected Response (200 OK):*
```json
{
  "category": "all",
  "total": 70.5,
  "count": 2
}
```

#### Total by Category:
```bash
curl -X GET "http://localhost:3000/api/expenses/total?category=Food"
```
*Expected Response (200 OK):*
```json
{
  "category": "Food",
  "total": 45.5,
  "count": 1
}
```

---

### 5. Delete Expense by ID (DELETE)
Replace `<EXPENSE_ID>` with an actual `id` returned from the `POST` or `GET` endpoints:
```bash
curl -X DELETE http://localhost:3000/api/expenses/<EXPENSE_ID>
```
*Expected Response (200 OK):*
```json
{
  "message": "Expense deleted successfully",
  "deleted": {
    "id": "<EXPENSE_ID>",
    "title": "Groceries",
    "amount": 45.5,
    "category": "Food",
    "date": "2026-08-01T00:00:00.000Z"
  }
}
```

#### Deleting a Non-Existent ID (Failure Case):
```bash
curl -X DELETE http://localhost:3000/api/expenses/invalid-id-123
```
*Expected Response (404 Not Found):*
```json
{
  "error": "Expense not found"
}
```
