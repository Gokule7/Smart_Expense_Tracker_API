const app = require('./app');
const storage = require('./storage');

const PORT = process.env.PORT || 3000;

async function startServer() {
  await storage.ensureDataFileExists();
  app.listen(PORT, () => {
    console.log(`Smart Expense Tracker API running on http://localhost:${PORT}`);
    console.log(`Swagger documentation available at http://localhost:${PORT}/api/docs`);
  });
}

startServer();
