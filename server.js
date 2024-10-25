// server.js
const express = require('express');
const routes = require('./routes/index');
const { PORT = 5000 } = process.env;

const app = express();

// Load all routes
app.use('/', routes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
