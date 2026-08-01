const crypto = require('crypto');
const storage = require('./storage');

async function addExpense(req, res) {
  try {
    const { title, amount, category, date } = req.body;

    if (!title || amount === undefined || amount === null || !category || !date) {
      return res.status(400).json({ error: 'Missing required fields: title, amount, category, and date are required' });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    const expenses = await storage.readExpenses();
    const newExpense = {
      id: crypto.randomUUID(),
      title: title.trim(),
      amount: parsedAmount,
      category: category.trim(),
      date: new Date(date).toISOString()
    };

    expenses.push(newExpense);
    await storage.writeExpenses(expenses);

    return res.status(201).json(newExpense);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error while saving expense' });
  }
}

async function getAllExpenses(req, res) {
  try {
    const expenses = await storage.readExpenses();
    return res.status(200).json(expenses);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error while fetching expenses' });
  }
}

async function filterExpenses(req, res) {
  try {
    const { category } = req.query;
    if (!category) {
      return res.status(400).json({ error: 'Query parameter "category" is required' });
    }

    const expenses = await storage.readExpenses();
    const filtered = expenses.filter(
      (exp) => exp.category.toLowerCase() === category.trim().toLowerCase()
    );

    return res.status(200).json(filtered);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error while filtering expenses' });
  }
}

async function getTotalExpenses(req, res) {
  try {
    const { category } = req.query;
    const expenses = await storage.readExpenses();

    let targetExpenses = expenses;
    if (category) {
      targetExpenses = expenses.filter(
        (exp) => exp.category.toLowerCase() === category.trim().toLowerCase()
      );
    }

    const total = targetExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    return res.status(200).json({
      category: category || 'all',
      total: Number(total.toFixed(2)),
      count: targetExpenses.length
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error while calculating total' });
  }
}

async function deleteExpense(req, res) {
  try {
    const { id } = req.params;
    const expenses = await storage.readExpenses();

    const index = expenses.findIndex((exp) => exp.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    const [deleted] = expenses.splice(index, 1);
    await storage.writeExpenses(expenses);

    return res.status(200).json({ message: 'Expense deleted successfully', deleted });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error while deleting expense' });
  }
}

module.exports = {
  addExpense,
  getAllExpenses,
  filterExpenses,
  getTotalExpenses,
  deleteExpense
};
