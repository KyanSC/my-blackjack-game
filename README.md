# Blackjack

A web-based implementation of the classic Blackjack card game, built with React for the frontend and Python FastAPI for the backend.

## 🚀 Play Now!

Visit [https://blackjack-kyan.vercel.app](https://blackjack-kyan.vercel.app) to play the game directly in your browser.


**Note:** This game runs on **mobile devices**, but the full screen may not be visible. For the best experience, play on a **desktop or laptop**.

## Features

- Classic Blackjack gameplay
- Real-time card animations
- Win/loss tracking
- Victory celebrations
- Clean, modern interface

## Tech Stack

- Frontend:
  - React
  - Framer Motion for animations
  - CSS3 with modern features
- Backend:
  - Python FastAPI
  - Uvicorn server

## Local Development

If you want to run the project locally:

1. Clone the repository
2. Set up the backend:
```bash
cd backend
pip install -r requirements.txt
uvicorn backend:app --reload
```

3. Set up the frontend:
```bash
cd frontend
npm install
npm start
```

4. Open http://localhost:3000 in your browser


## API Documentation

Backend endpoints:
- `GET /start` - Start a new game
- `GET /hit` - Draw a card
- `GET /stand` - End player's turn
- `GET /status` - Get current game state
