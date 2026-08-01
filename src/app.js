const express = require('express');
const swaggerUi = require('swagger-ui-express');
const routes = require('./routes');

const app = express();

app.use(express.json());

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Smart Expense Tracker API',
    version: '1.0.0',
    description: 'A simple REST API for managing personal expenses stored in a local JSON file.'
  },
  paths: {
    '/api/expenses': {
      post: {
        summary: 'Add an expense',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string', example: 'Groceries' },
                  amount: { type: 'number', example: 45.50 },
                  category: { type: 'string', example: 'Food' },
                  date: { type: 'string', format: 'date', example: '2026-08-01' }
                },
                required: ['title', 'amount', 'category', 'date']
              }
            }
          }
        },
        responses: {
          '201': { description: 'Expense created successfully' },
          '400': { description: 'Bad request - invalid fields' }
        }
      },
      get: {
        summary: 'View all expenses',
        responses: {
          '200': { description: 'List of all expenses' }
        }
      }
    },
    '/api/expenses/filter': {
      get: {
        summary: 'Filter expenses by category',
        parameters: [
          {
            name: 'category',
            in: 'query',
            required: true,
            schema: { type: 'string' },
            example: 'Food'
          }
        ],
        responses: {
          '200': { description: 'Filtered expenses list' },
          '400': { description: 'Missing category parameter' }
        }
      }
    },
    '/api/expenses/total': {
      get: {
        summary: 'Calculate total expenses',
        parameters: [
          {
            name: 'category',
            in: 'query',
            required: false,
            schema: { type: 'string' },
            example: 'Food'
          }
        ],
        responses: {
          '200': { description: 'Calculated total expense amount' }
        }
      }
    },
    '/api/expenses/{id}': {
      delete: {
        summary: 'Delete an expense by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': { description: 'Expense deleted' },
          '404': { description: 'Expense not found' }
        }
      }
    }
  }
};

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', routes);

module.exports = app;
