const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const contractRoutes = require('./routes/contractRoutes');
const fs = require('fs');
const path = require('path');

dotenv.config();
const connectDB = require('./config/db');
connectDB();
const app = express();

const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/me', authMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});
app.use('/api/contract', contractRoutes);

app.get('/', (req, res) => {
  res.send('LegalLens AI backend is running ✅');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
