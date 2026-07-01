"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const gameRoutes_1 = __importDefault(require("./routes/gameRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Enable CORS so the React client (on port 3000) can communicate with the backend
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));
// Parse incoming request bodies as JSON
app.use(express_1.default.json());
// Simple logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});
// Mount game routes
app.use('/api', gameRoutes_1.default);
// Healthcheck route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date() });
});
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Tic-Tac-Toe game server running on http://localhost:${PORT}`);
});
