# Smart IoT Dashboard - Complete Setup Guide

A comprehensive guide to set up the Smart IoT Dashboard application.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Supabase Setup](#supabase-setup)
3. [Frontend Setup](#frontend-setup)
4. [Backend Setup](#backend-setup)
5. [Running the Application](#running-the-application)
6. [Deployment](#deployment)

## Prerequisites

- Node.js 16+ and npm
- Git
- Supabase account (free tier available)
- Code editor (VS Code recommended)

## Supabase Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - Name: `smart-iot-dashboard`
   - Database Password: Create a strong password
   - Region: Choose closest to you
5. Click "Create new project"

### 2. Get API Keys

1. Go to Project Settings → API
2. Copy:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_KEY` (backend only)

### 3. Create Database Tables

1. Go to SQL Editor
2. Create new query
3. Copy and paste the SQL from `database/schema.sql`
4. Click "Run"

### 4. Enable Row Level Security (RLS)

1. Go to Authentication → Policies
2. For each table, enable RLS and add policies from `database/rls-policies.sql`

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

Output will be in `dist/` folder.

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```
NODE_ENV=development
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
FRONTEND_URL=http://localhost:3000
IOT_API_KEY=your-iot-api-key
```

### 3. Start Development Server

```bash
npm run dev
```

The API will run on `http://localhost:5000`

### 4. Test API

```bash
# Health check
curl http://localhost:5000/health

# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'
```

## Running the Application

### Development Mode

Terminal 1 - Frontend:
```bash
cd frontend
npm run dev
```

Terminal 2 - Backend:
```bash
cd backend
npm run dev
```

Terminal 3 - Supabase (optional, if using local):
```bash
supabase start
```

### Production Mode

Frontend:
```bash
cd frontend
npm run build
npm run preview
```

Backend:
```bash
cd backend
npm start
```

## Database Schema

### Tables

#### user_profiles
```sql
- id (UUID, PK)
- full_name (TEXT)
- email (TEXT)
- role (TEXT: 'user' or 'admin')
- notifications_enabled (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### dustbin_logs
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- status (TEXT: 'full' or 'empty')
- level (INTEGER: 0-100)
- created_at (TIMESTAMP)
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/signin` - Login
- `POST /api/auth/verify` - Verify token

### Dustbin Logs
- `GET /api/dustbin/logs` - Get all logs
- `GET /api/dustbin/logs/:id` - Get single log
- `POST /api/dustbin/logs` - Create log
- `GET /api/dustbin/stats/monthly` - Monthly stats
- `GET /api/dustbin/stats/range` - Date range stats
- `POST /api/dustbin/device/log` - IoT device endpoint

### User Profile
- `GET /api/profile` - Get profile
- `PUT /api/profile` - Update profile
- `DELETE /api/profile` - Delete account

## Deployment

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Set environment variables
5. Deploy

### Backend Deployment (Railway/Heroku)

#### Railway
1. Go to [railway.app](https://railway.app)
2. Create new project
3. Connect GitHub repository
4. Add environment variables
5. Deploy

#### Heroku
```bash
heroku create your-app-name
heroku config:set SUPABASE_URL=...
heroku config:set SUPABASE_SERVICE_KEY=...
git push heroku main
```

## Troubleshooting

### Frontend Issues

**Port 3000 already in use:**
```bash
npm run dev -- --port 3001
```

**Module not found:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Backend Issues

**Port 5000 already in use:**
```bash
PORT=5001 npm run dev
```

**Supabase connection error:**
- Check `.env` file
- Verify Supabase URL and keys
- Check internet connection

### Database Issues

**RLS policies not working:**
- Ensure RLS is enabled on tables
- Check policy conditions
- Verify user authentication

**Connection timeout:**
- Check Supabase project status
- Verify network connectivity
- Check firewall settings

## Security Checklist

- [ ] Change default Supabase password
- [ ] Enable 2FA on Supabase account
- [ ] Set strong JWT secret
- [ ] Enable HTTPS in production
- [ ] Set CORS properly
- [ ] Rotate API keys regularly
- [ ] Use environment variables for secrets
- [ ] Enable RLS on all tables
- [ ] Set up rate limiting
- [ ] Monitor API usage

## Performance Tips

1. **Frontend:**
   - Enable code splitting
   - Optimize images
   - Use lazy loading
   - Minimize bundle size

2. **Backend:**
   - Add database indexes
   - Use pagination
   - Cache frequently accessed data
   - Monitor query performance

3. **Database:**
   - Create indexes on foreign keys
   - Archive old data
   - Use connection pooling
   - Monitor query logs

## Next Steps

1. Customize branding and colors
2. Add more features (maps, notifications, etc.)
3. Set up CI/CD pipeline
4. Configure monitoring and logging
5. Set up automated backups
6. Create admin dashboard
7. Add email notifications
8. Implement real-time updates

## Support

- Frontend issues: Check `frontend/README.md`
- Backend issues: Check `backend/README.md`
- Supabase docs: https://supabase.com/docs
- React docs: https://react.dev
- Express docs: https://expressjs.com

## License

MIT
