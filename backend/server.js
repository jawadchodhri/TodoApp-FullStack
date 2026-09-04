import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import connectDB from './config/database.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoRoutes.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// CORS configuration (supports cookies and custom headers)
// Allowed frontend origins (both local and deployed)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL, // e.g. https://your-app.vercel.app
].filter(Boolean); // removes undefined if CLIENT_URL isn't set

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS'));
      }
    },
    credentials: true,
  })
);

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'TodoApp API is healthy and running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});