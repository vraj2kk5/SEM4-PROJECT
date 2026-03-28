# Installation Progress - Smart IoT Dashboard

## 🚀 Frontend Build in Progress

### Current Status
- **Process**: npm install && npm run dev
- **Location**: `frontend/` directory
- **Status**: ⏳ Installing dependencies (this can take 3-5 minutes)
- **Terminal ID**: 2

### What's Happening Right Now

1. **npm install phase** (currently running)
   - Downloading ~50+ npm packages
   - Installing React, Vite, Tailwind CSS, Recharts, etc.
   - Creating `node_modules` folder
   - Generating `package-lock.json`

2. **npm run dev phase** (will start after install completes)
   - Vite will start the development server
   - Hot module replacement (HMR) will be enabled
   - Server will listen on http://localhost:3000

### Expected Output When Complete

Once npm install finishes, you should see:
```
added XXX packages in XXXs

> smart-iot-dashboard@0.0.1 dev
> vite

  VITE v5.0.0  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

### What to Do When Dev Server Starts

1. **Open your browser** and go to http://localhost:3000
2. **You'll see the login page** with:
   - Email input field
   - Password input field
   - Sign up link
   - Forgot password link

3. **To test the app**, you need to:
   - Set up Supabase (see below)
   - Create an account
   - Log in

### Setting Up Supabase (Required to Use the App)

#### Step 1: Create Supabase Project
1. Go to https://supabase.com
2. Click "Sign Up"
3. Create account with GitHub or email
4. Click "New Project"
5. Fill in:
   - Project name: `smart-iot-dashboard`
   - Database password: Create a strong password
   - Region: Choose closest to you
6. Click "Create new project" (wait 2-3 minutes)

#### Step 2: Get API Keys
1. Go to Project Settings → API
2. Copy these values:
   - **Project URL** → Copy this
   - **anon public** key → Copy this
   - **service_role** key → Copy this (for backend)

#### Step 3: Create Database Tables
1. In Supabase, go to SQL Editor
2. Click "New Query"
3. Copy entire content from `database/schema.sql`
4. Paste into the SQL editor
5. Click "Run"
6. Wait for tables to be created

#### Step 4: Configure Frontend
1. In `frontend/` folder, create `.env.local` file
2. Add these lines:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```
3. Replace with your actual values from Step 2
4. Save the file

#### Step 5: Restart Frontend Dev Server
1. Stop the dev server (Ctrl+C in terminal)
2. Run: `npm run dev` again
3. The app will reload with Supabase connected

### Testing the Application

Once everything is set up:

1. **Create Account**
   - Go to http://localhost:3000
   - Click "Sign up"
   - Enter email and password
   - Click "Sign Up"

2. **Login**
   - Enter your email and password
   - Click "Sign In"

3. **Explore Features**
   - Dashboard: View charts and statistics
   - History: See data table with filters
   - Settings: Change password, toggle theme
   - Dark Mode: Click moon icon in navbar

### Backend Setup (Optional but Recommended)

To also run the backend API:

1. **Open new terminal** in `backend/` folder
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Create `.env` file**:
   ```bash
   cp .env.example .env
   ```
4. **Edit `.env`** with your Supabase credentials:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_KEY=your-service-key
   FRONTEND_URL=http://localhost:3000
   IOT_API_KEY=test-key
   ```
5. **Start backend**:
   ```bash
   npm run dev
   ```
6. **Backend will run on** http://localhost:5000

### Project Structure

```
SEM4-PROJECT/
├── frontend/                 # React app (currently building)
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── store/           # State management
│   │   └── styles/          # CSS
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/                  # Express API
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Auth middleware
│   │   └── index.js         # Server
│   └── package.json
│
├── database/                 # Database setup
│   ├── schema.sql           # Tables
│   └── rls-policies.sql     # Security
│
└── iot/                      # IoT code
    └── esp32_example.ino    # Arduino code
```

### Troubleshooting

#### npm install is taking too long
- This is normal for first install (3-5 minutes)
- Check internet connection
- If it fails, try: `npm cache clean --force`

#### Port 3000 already in use
- Vite will automatically use port 3001
- Or kill the process: `lsof -ti:3000 | xargs kill -9`

#### Blank page or errors
- Check browser console (F12)
- Check terminal for error messages
- Ensure `.env.local` is configured correctly

#### "Cannot find module" errors
- Delete `node_modules` folder
- Delete `package-lock.json`
- Run `npm install` again

### Features to Test

Once logged in, you can test:

✅ **Dashboard**
- View total usage count
- See full/empty events
- View charts (line, bar, pie)
- See recent activity

✅ **History**
- View all logs in table
- Sort by date or level
- Filter by status
- Export as CSV
- Pagination

✅ **Settings**
- Change password
- Toggle dark/light mode
- Manage notifications
- View profile

✅ **UI/UX**
- Responsive design (resize browser)
- Dark mode toggle
- Smooth animations
- Loading states

### Next Steps After Installation

1. ✅ Wait for npm install to complete
2. ✅ Dev server starts automatically
3. ✅ Open http://localhost:3000
4. ✅ Set up Supabase
5. ✅ Create account and test
6. ✅ (Optional) Set up backend
7. ✅ Deploy to production

### Deployment

When ready to deploy:

**Frontend to Vercel:**
```bash
npm run build
vercel deploy
```

**Backend to Railway:**
```bash
railway up
```

See `SETUP_GUIDE.md` for detailed deployment instructions.

---

**Installation started**: 2026-03-28
**Expected completion**: 3-5 minutes
**Status**: In Progress ⏳
