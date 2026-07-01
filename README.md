# 🎮 Grid Genius

Grid Genius is an ultra-premium, full-stack Tic-Tac-Toe application. It utilizes a **React + TypeScript + Vite + Tailwind CSS** frontend and a **Node.js + Express + TypeScript** backend, deployed as a unified monorepo. 

Every move is validated in real-time by the backend server, which acts as the ultimate **source of truth** for rule checks, winning lines, and draw detections.

---

## ✨ Features

- **Backend Validation**: In-game moves are verified via API requests to prevent invalid moves (e.g., clicking occupied cells, playing after game-over).
- **Vibrant Neon Aesthetics**: Sleek dark theme featuring responsive glow effects, faded hover previews of active marks, and pulsing neon highlights on winning lines.
- **Continuous Scoreboard**: Keeps local track of Player X wins, Player O wins, and Draws.
- **Vercel-Ready Workspaces**: Configured using npm workspaces to install dependencies safely and compile serverless backend endpoints automatically.

---

## 🛠️ Technology Stack

- **Frontend**: React (v18), TypeScript, Vite, Tailwind CSS, Lucide Icons, and custom Shadcn-style components (utils, buttons, cards).
- **Backend**: Node.js, Express, CORS.
- **Deployment**: Vercel Serverless Functions.

---

## 📂 Project Structure

```text
grid-genius/
├── api/
│   └── index.ts          # Vercel Serverless Function entry point
├── client/
│   ├── src/              # React application source code
│   ├── public/           # Static assets (transparent XG logos)
│   └── vite.config.ts    # Vite config with dev proxy setting
├── server/
│   ├── src/
│   │   ├── controllers/  # Game logic rules engine (source of truth)
│   │   ├── routes/       # Express route mapping
│   │   └── index.ts      # Traditional local server bootstrapper
│   └── tsconfig.json
├── vercel.json           # Vercel Serverless rewrite configurations
├── package.json          # Root npm workspaces orchestrator
└── .gitignore            # Clean git commits rule mapping
```

---

## 🚀 Local Development Setup

To run the application locally, ensure you have **Node.js (LTS)** installed.

### 1. Install Dependencies
Run the install command at the **root directory**. Npm workspaces will automatically install and link all modules:
```bash
npm install
```

### 2. Start the Backend Server
From the root directory, start the Express backend (runs on `http://localhost:5000`):
```bash
cd server
npm run dev
```

### 3. Start the Frontend Client
In a new terminal window, start the Vite React dev server (runs on `http://localhost:3000`):
```bash
cd client
npm run dev
```

*Note: The React client is pre-configured with a Vite development proxy. It routes relative requests like `/api/move` to `http://localhost:5000` automatically.*

---

## ☁️ Deployment on Vercel

This repository is optimized for zero-config Vercel Serverless Monorepo deployment.

1. Push your monorepo codebase to a **GitHub repository**.
2. Go to your **Vercel Dashboard** and click **Import Project**.
3. Select your GitHub repository.
4. Apply the following **Project Settings**:
   - **Root Directory**: Leave it as the root (`./` or blank). **Do NOT select `/client`**.
   - **Build and Output Settings** (Expand this section):
     - Toggle **Output Directory** to override, and type: **`client/dist`**
     - Leave the *Build Command* and *Install Command* default (Vercel will run `npm run build` from our root `package.json` workspaces setting).
5. Click **Deploy**!
