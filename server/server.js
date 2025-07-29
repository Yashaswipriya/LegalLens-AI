const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const contractRoutes = require('./routes/contractRoutes');

dotenv.config();
const connectDB = require('./config/db');
connectDB();
const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/me', authMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});
app.use('/api/contract', contractRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
