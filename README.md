# SearchBoost - SEO Suggestion Search Engine (MERN)

A complete MERN stack project with:

- **MongoDB** for storing generated suggestion history
- **Express + Node.js** backend API
- **React (Vite)** frontend with live keyword input

## Features

- Live SEO suggestion generation (long-tail, question-based, intent variants)
- SEO score, keyword difficulty, and estimated volume
- Search history persisted in MongoDB
- Full-stack local development with one command

## Project Structure

```bash
search-boost/
  client/   # React app
  server/   # Express API
```

## Run Locally

### 1) Install dependencies

```bash
npm install
```

### 2) Setup environment

Create `server/.env` from `server/.env.example`:

```bash
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/searchboost
```

### 3) Start MongoDB

Make sure MongoDB is running locally on port `27017`.

### 4) Start full stack

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## API Endpoints

- `GET /api/health`
- `GET /api/suggestions?keyword=<text>&limit=12`
- `GET /api/suggestions/history`

## Build Frontend

```bash
npm run build
```