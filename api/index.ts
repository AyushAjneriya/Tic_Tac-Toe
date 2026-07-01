import express from 'express';
import cors from 'cors';
import gameRoutes from '../server/src/routes/gameRoutes';

const app = express();

// Enable CORS
app.use(cors());

// Parse incoming request bodies as JSON
app.use(express.json());

// Mount game routes
app.use('/api', gameRoutes);

// Export the Express app instance for Vercel Serverless Function routing
export default app;
