// server/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const linkRoutes = require('./routes/linkRoutes');
const redirectRoutes = require('./routes/redirectRoute'); // ✅ FIXED name
const authRoutes = require('./routes/authRoutes');

dotenv.config();
const app = express();

// ✅ Use Render's dynamic port
const PORT = process.env.PORT || 5000;

// Connect to DB before anything else
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/links', linkRoutes);
app.use('/api/auth', authRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.send('API is healthy!');
});

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Keep redirect route last
app.use('/', redirectRoutes); // ✅ KEEP THIS LAST

// Start server after DB connection
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
