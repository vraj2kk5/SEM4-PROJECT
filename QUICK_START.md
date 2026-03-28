# Quick Start Guide - Smart IoT Dashboard

Get up and running in 5 minutes!

## 1️⃣ Prerequisites

```bash
# Check Node.js version (need 16+)
node --version
npm --version
```

## 2️⃣ Supabase Setup (2 minutes)

1. Go to [supabase.com](https://supabase.com) → Sign up
2. Create new project
3. Go to Settings → API
4. Copy your credentials:
   - `Project URL` 
   - `anon public` key
   - `service_role` key

## 3️⃣ Frontend Setup (1 minute)

```bash
cd frontend
npm install
cp .env.example .env.local
```

Edit `.env.local`:
```
VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-key
```

Start:
```bash
npm run dev
```

→ Open http://localhost:3000

## 4️⃣ Backend Setup (1 minute)

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```
SUPABASE_URL=your-url
SUPABASE_SERVICE_KEY=your-service-key
FRONTEND_URL=http://localhost:3000
IOT_API_KEY=test-key
```

Start:
```bash
npm run dev
```

→ API runs on http://localhost:5000

## 5️⃣ Database Setup (1 minute)

1. In Supabase, go to SQL Editor
2. Create new query
3. Copy-paste from `database/schema.sql`
4. Click "Run"

## ✅ Done!

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Create account and start using!

## 📚 Next Steps

- Read [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup
- Check [frontend/README.md](./frontend/README.md) for frontend docs
- Check [backend/README.md](./backend/README.md) for API docs
- Deploy to production (see SETUP_GUIDE.md)

## 🆘 Troubleshooting

**Port already in use?**
```bash
# Frontend on different port
npm run dev -- --port 3001

# Backend on different port
PORT=5001 npm run dev
```

**Module not found?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Supabase connection error?**
- Check `.env` file
- Verify credentials are correct
- Ensure Supabase project is active

## 🚀 Production Deployment

### Frontend (Vercel)
```bash
npm run build
vercel deploy
```

### Backend (Railway)
```bash
railway up
```

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed deployment.

---

**Questions?** Check the full documentation or open an issue on GitHub!
