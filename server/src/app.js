const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');

// const aiQueryRoutes = require('./api/aiQuery');
const subscriptionRoutes = require('./api/subscriptionSearch');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // logs incoming requests to console

// Routes
app.use('/api', subscriptionRoutes);

module.exports = app; // Export the app
