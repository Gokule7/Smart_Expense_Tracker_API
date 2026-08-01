const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.post('/expenses', controller.addExpense);
router.get('/expenses', controller.getAllExpenses);
router.get('/expenses/filter', controller.filterExpenses);
router.get('/expenses/total', controller.getTotalExpenses);
router.delete('/expenses/:id', controller.deleteExpense);

module.exports = router;
