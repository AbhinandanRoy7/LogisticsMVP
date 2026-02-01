# Logistics Management Dashboard (MVP)

## Project Overview
This is a full-stack real-time logistics dashboard using Node.js, Express, React, Postgres, and Socket.io.

## Prerequisites
1. **Node.js**: Installed on your system.
2. **PostgreSQL**: You need a running Postgres database.
   - Local install: [Download PostgreSQL](https://www.postgresql.org/download/)
   - Or allow creating one.

## Setup Instructions

### 1. Database Setup
Ensure your PostgreSQL server is running. Create a database named `logistics` (or whatever you prefer).
Update the connection string in `backend/.env` with your credentials:
```env
DATABASE_URL="postgresql://your_user:your_password@localhost:5432/logistics?schema=public"
```

### 2. Backend Setup
1. Open a terminal in the `backend` folder.
2. Install dependencies (if not done):
   ```bash
   npm install
   ```
3. Push the database schema:
   ```bash
   npx prisma db push
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:3000`.

### 3. Frontend Setup
1. Open a NEW terminal in the `frontend` folder.
2. Install dependencies (if not done):
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

### 4. Implementation Details
- **Tech Stack**: React + Vite (Frontend), Node.js + Express (Backend), Prisma (ORM), Postgres (DB).
- **Real-time**: Socket.io updates shipments instantly across clients.
- **Auth**: JWT-based auth with OTP (Simulated console log in dev mode if email not inferred).
- **Styling**: Tailwind CSS + "Shadcn-like" manual components in `src/components/ui`.

## Usage
1. Go to `http://localhost:5173`.
2. Click **Register (Admin)** on the login page to create an admin user.
3. Login with the email/password. 
4. Check the **Backend Terminal** for the OTP code (it is logged to console if SMTP is not configured).
5. Enter OTP to verify.
6. As Admin, create shipments in the **Shipments** page.
7. Open the app in another browser window (incognito) to simulate another user. Updates happen in real-time.
