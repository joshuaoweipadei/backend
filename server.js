const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const dbConnect = require('./db');

// Define port
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 7000;

app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(cors());

// Database connection
dbConnect();

// API Routes
app.use('/api/account', require('./controllers/account.controller'));

// Start server
app.listen(port, () => console.log('Server listening on port ' + port)); 