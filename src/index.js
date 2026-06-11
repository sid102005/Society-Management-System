require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const rateLimit = require('express-rate-limit');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rate limiting - more generous for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // limit each IP to 1000 requests per windowMs
});

// Apply rate limit to all API routes except auth
app.use('/api/', (req, res, next) => {
  if (req.path.startsWith('/auth')) {
    return next();
  }
  limiter(req, res, next);
});

// Routes
app.use('/api', routes);

// Error handling middleware
app.use(errorHandler);

// Health check
app.get('/health', (req, res) => {
  res.json({ message: 'Server is running', timestamp: new Date() });
});

const PORT = process.env.PORT || 4000;
connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/society')
  .then(() => {
    const server = app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
    server.on('error', err => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Stop other servers using that port or set a different PORT in .env.`);
      } else {
        console.error('❌ Server error:', err);
      }
      process.exit(1);
    });
  })
  .catch(err => {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  });
