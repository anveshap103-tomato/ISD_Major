import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import feedRoutes from './modules/feed/feed.routes.js';
import usersRoutes from './modules/users/users.routes.js';

// Import cross-cutting middleware
import { errorHandler } from './middlewares/errorHandler.js';

// Import domain module routes
import authRoutes from './modules/auth/auth.routes.js';
import contentRoutes from './modules/content/content.routes.js';
import creatorsRoutes from './modules/creators/creators.routes.js';
import connectionsRoutes from './modules/connections/connections.routes.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


// Base middlewares
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((o) => o.trim())
  : ['*'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      // Allow wildcard or explicit matches
      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow any vercel deployment preview / production or localhost
      if (
        /^https?:\/\/localhost(:\d+)?$/.test(origin) ||
        origin.endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'Ryth Core API' });
});

// Mount module routers
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/creators', creatorsRoutes);
app.use('/api/connections', connectionsRoutes);
app.use('/api/feed', feedRoutes);

// Centralized error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[Ryth Core API] Server listening on port ${PORT}`);
});

export default app;

