const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { authenticateJWT } = require('./middleware/auth');
const { apiLimiter } = require('./middleware/rateLimiter');

// Import Route Handlers
const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/categories.routes');
const quizRoutes = require('./routes/quiz.routes');
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');
const searchRoutes = require('./routes/search.routes');
const feedbackRoutes = require('./routes/feedback.routes');
const swaggerRoutes = require('./docs/swagger');

const app = express();

// Security Headers with relaxed CSP for local media and Swagger UI
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive for local development
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// Global Authentication Middleware (attaches req.user if valid token exists)
app.use(authenticateJWT);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Sahay API Backend',
    database: 'connected (SQLite)'
  });
});

// Swagger / OpenAPI Interactive Documentation
app.use('/api/docs', swaggerRoutes);

// Versioned API Routes (/api/v1)
const v1Router = express.Router();
v1Router.use('/auth', authRoutes);
v1Router.use('/categories', categoryRoutes);
v1Router.use('/quiz', quizRoutes);
v1Router.use('/me', userRoutes);
v1Router.use('/admin', adminRoutes);
v1Router.use('/search', searchRoutes);
v1Router.use('/feedback', feedbackRoutes);

app.use('/api/v1', apiLimiter, v1Router);

// 404 Handler for API
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, error: 'API route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

module.exports = app;
