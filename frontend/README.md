# Smart IoT Dashboard - Frontend

A modern, responsive React dashboard for monitoring and managing IoT dustbins with real-time analytics.

## Features

- 🔐 **Secure Authentication** - Email/password login with JWT
- 📊 **Real-time Analytics** - Charts and statistics
- 🌙 **Dark/Light Mode** - Theme toggle
- 📱 **Fully Responsive** - Mobile, tablet, desktop
- 🎨 **Modern UI** - Glassmorphism design with Tailwind CSS
- 📈 **Charts** - Line, bar, and pie charts with Recharts
- 📋 **History** - Sortable, filterable data table with pagination
- ⚙️ **Settings** - Profile, password, and notification management
- 🔔 **Real-time Updates** - Supabase subscriptions

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Recharts** - Charts
- **Zustand** - State management
- **React Router** - Routing
- **Supabase** - Backend & Auth
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/vraj2kk5/SEM4-PROJECT.git
cd frontend
```

2. Install dependencies
```bash
npm install
```

3. Create `.env.local` file
```bash
cp .env.example .env.local
```

4. Add your Supabase credentials
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

5. Start development server
```bash
npm run dev
```

The app will open at `http://localhost:3000`

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Card.jsx
│   ├── StatCard.jsx
│   ├── Layout.jsx
│   ├── Sidebar.jsx
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx
│   ├── LoadingSkeleton.jsx
│   └── Toast.jsx
├── pages/              # Page components
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   ├── ForgotPasswordPage.jsx
│   ├── DashboardPage.jsx
│   ├── HistoryPage.jsx
│   └── SettingsPage.jsx
├── services/           # API services
│   └── supabaseClient.js
├── store/              # Zustand stores
│   ├── authStore.js
│   ├── themeStore.js
│   └── dashboardStore.js
├── styles/             # Global styles
│   └── index.css
├── App.jsx             # Main app component
└── main.jsx            # Entry point
```

## Key Features

### Authentication
- Sign up with email and password
- Login with credentials
- Password reset via email
- Session persistence
- JWT-based auth

### Dashboard
- Total usage statistics
- Full/Empty event counts
- Monthly usage trends (line chart)
- Daily activity (bar chart)
- Full vs Empty distribution (pie chart)
- Recent activity feed

### History
- Sortable data table
- Filter by status (Full/Empty)
- Pagination
- CSV export
- Fill level visualization

### Settings
- Change password
- Theme toggle (dark/light)
- Notification preferences
- User profile management

## Environment Variables

```
VITE_SUPABASE_URL      - Your Supabase project URL
VITE_SUPABASE_ANON_KEY - Your Supabase anonymous key
```

## Building for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

## Database Schema

The app expects these Supabase tables:

### dustbin_logs
```sql
CREATE TABLE dustbin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  status TEXT NOT NULL CHECK (status IN ('full', 'empty')),
  level INTEGER NOT NULL CHECK (level >= 0 AND level <= 100),
  created_at TIMESTAMP DEFAULT now()
);
```

### user_profiles
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMP DEFAULT now()
);
```

## Row Level Security (RLS)

Enable RLS on both tables:

```sql
-- dustbin_logs RLS
ALTER TABLE dustbin_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own logs"
  ON dustbin_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own logs"
  ON dustbin_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- user_profiles RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);
```

## API Integration

The app connects to Supabase using the official client. All API calls are abstracted in `services/supabaseClient.js`.

### Available Services

- `authService` - Authentication
- `dustbinService` - Dustbin logs
- `profileService` - User profiles

## Performance Optimizations

- Lazy loading components
- Memoized components
- Efficient re-renders
- Optimized charts
- Pagination for large datasets

## Security

- JWT authentication
- Row Level Security (RLS)
- Input validation with Zod
- Protected routes
- Secure password handling
- HTTPS only

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
