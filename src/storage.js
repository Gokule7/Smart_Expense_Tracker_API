const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/expenses.json');

async function ensureDataFileExists() {
  try {
    const dirPath = path.dirname(DATA_FILE);
    await fs.mkdir(dirPath, { recursive: true });
    try {
      await fs.access(DATA_FILE);
    } catch {
      await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error ensuring data file exists:', err);
    throw err;
  }
}

async function readExpenses() {
  try {
    await ensureDataFileExists();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('Error reading expenses:', err);
    return [];
  }
}

async function writeExpenses(expenses) {
  try {
    await ensureDataFileExists();
    await fs.writeFile(DATA_FILE, JSON.stringify(expenses, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing expenses:', err);
    throw err;
  }
}

module.exports = {
  ensureDataFileExists,
  readExpenses,
  writeExpenses
};
