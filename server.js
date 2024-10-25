const express = require('express');
const routes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // Middleware to parse JSON request bodies
app.use('/', routes); // Mount the router on the root path

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
