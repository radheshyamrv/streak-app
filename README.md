# Streak — MERN Habit & Consistency Tracker

A full MERN application for task streaks, modules, cheat days, freeze rules,
daily medium/hard prefrontal-cortex challenges, history, dashboard statistics,
and JWT authentication.

## Requirements
- Node.js 20+
- MongoDB local or MongoDB Atlas

## Setup

### 1. Backend
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Set `MONGO_URI` and `JWT_SECRET` in `.env`.

### 2. Frontend
Open another terminal:
```bash
cd client
npm install
npm run dev
```

The Vite frontend uses `http://localhost:5000/api` by default.

## Default flow
1. Register
2. Login
3. Create modules
4. Create tasks with a target number of days
5. Complete tasks every day
6. Use earned cheat days when needed
7. Request freezes only when the backend rules allow them
8. Complete the daily medium/hard challenge
9. Review dashboard and history

## Business rules
- Cheat-day allowance: 1 earned cheat day for each completed 7-day block.
- A cheat day can preserve a task streak for one missed day.
- Freeze requires 10 continuous qualifying days immediately before the freeze.
- Maximum freeze length: 3 days.
- Only one freeze period can start in a rolling 30-day period.
- Freeze requires a reason.
- Daily PFC challenges are medium or hard only.
- Challenge history is stored so the same challenge is not repeatedly selected.

This project intentionally keeps the business rules on the server so the
browser cannot simply change streak values.
