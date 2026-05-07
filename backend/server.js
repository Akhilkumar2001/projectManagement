import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.js';
import userRoutes from './src/routes/users.js';
import projectRoutes from './src/routes/projects.js';
import taskRoutes from './src/routes/tasks.js';
import subtaskRoutes from './src/routes/subtasks.js';
import activityRoutes from './src/routes/activity.js';
import campaignRoutes from './src/routes/campaigns.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

connectDB();

// CORS must be first — before helmet/rate-limit so OPTIONS preflight passes
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.options('*', cors()); // handle preflight for all routes

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Strict limiter — only for login/register to prevent brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20,                   // 20 login attempts per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts, please try again after 15 minutes.' },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// General API limiter — generous for normal app usage
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 min window
  max: process.env.NODE_ENV === 'development' ? 500 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS', // skip preflight
  message: { success: false, message: 'Too many requests, please slow down.' },
});
app.use('/api/', apiLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files as static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/subtasks', subtaskRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/campaigns', campaignRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
