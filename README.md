# DevPulse - Internal Tech Issue & Feature Tracker

A platform for software teams to report bugs, suggest features, and coordinate resolutions.

**Live URL:** ``\*

---

## Features

- User registration and login with JWT authentication
- Two user roles: **contributor** and **maintainer**
- Create, view, update, and delete issues (bug reports & feature requests)
- Filtering issues by type and status
- Sorting issues by newest or oldest
- Role-based control on all protected routes

## Tech Stack

Node.js (LTS) as Runtime
TypeScript as Language
Express.js for Web Framework
PostgreSQL for Database
pg (native) for Database Driver
bcrypt for Password Hashing
jsonwebtoken for Authentication
http-status-codes for Status Codes

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone ....
cd devpulse
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up env variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```
PORT=5000
DATABASE_URL=postgresql://user:password@host/assignment-2
JWT_SECRET=your_secret_key_here
```

### 4. Setting up the database

Run the Quries in `src/config/db.ts` on your PostgreSQL database (NeonDB, Supabase, etc.):

```sql
CREATE TABLE IF NOT EXISTS users ( ... );
CREATE TABLE IF NOT EXISTS issues ( ... );
```

### 5. Run the development server

```bash
npm run dev
```

---

## API Endpoints

### Auth

POST : `/api/auth/signup` Public Register a new user
POST : `/api/auth/login` Public Login and get JWT token

### Issues

GET : `/api/issues` Public Get all issues
GET : `/api/issues/:id` Public Get a single issue
POST : `/api/issues` Authenticated Create a new issue
PATCH : `/api/issues/:id` Authenticated Update an issue
DELETE : `/api/issues/:id` Maintainer only Delete an issue

---

## Database Schema

### users table

id SERIAL Primary key
name VARCHAR(255) Required
email VARCHAR(255) Unique, required
password VARCHAR(255) Hashed, never returned
role VARCHAR(20) `contributor` or `maintainer`, default `contributor`
created_at TIMESTAMPTZ Auto-generated
updated_at TIMESTAMPTZ Auto-refreshed

### issues table

id SERIAL Primary key
title VARCHAR(150) Required, max 150 chars
description TEXT Required, min 20 chars
type VARCHAR(30) `bug` or `feature_request`
status VARCHAR(20) `open`, `in_progress`, `resolved`, default `open`
reporter_id INTEGER References user id (app-level validation)
created_at TIMESTAMPTZ Auto-generated
updated_at TIMESTAMPTZ Auto-refreshed
