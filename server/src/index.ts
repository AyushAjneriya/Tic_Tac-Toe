import express from 'express';
import cors from 'cors';
import gameRoutes from './routes/gameRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS so the React client (on port 3000) can communicate with the backend
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// Parse incoming request bodies as JSON
app.use(express.json());

// Simple logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Mount game routes
app.use('/api', gameRoutes);

// Healthcheck route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Tic-Tac-Toe game server running on http://localhost:${PORT}`);
});
