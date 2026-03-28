# Smart IoT Dashboard

A modern, full-stack IoT dashboard application for monitoring and managing smart dustbins with real-time analytics, secure authentication, and IoT device integration.

## 🎯 Overview

Smart IoT Dashboard is a production-ready SaaS-style application that enables users to:
- Monitor dustbin fill levels in real-time
- View comprehensive analytics and statistics
- Manage multiple IoT devices
- Receive alerts when bins are full
- Export data for analysis

## ✨ Features

### 🔐 Authentication & Security
- Email/password authentication with Supabase Auth
- JWT-based session management
- Password reset functionality
- Row Level Security (RLS) for data protection
- Secure API endpoints with token verification

### 📊 Dashboard
- Real-time statistics and KPIs
- Interactive charts (line, bar, pie)
- Monthly usage trends
- Daily activity visualization
- Recent activity feed
- Fill level distribution

### 📋 History & Analytics
- Sortable, filterable data table
- Pagination support
- CSV export functionality
- Date range filtering
- Status-based filtering
- Fill level visualization

### ⚙️ Settings & Profile
- User profile management
- Password change functionality
- Theme toggle (dark/light mode)
- Notification preferences
- Account management

### 🌙 UI/UX
- Modern glassmorphism design
- Fully responsive (mobile, tablet, desktop)
- Dark and light mode support
- Smooth animations and transitions
- Loading skeletons
- Toast notifications
- Clean typography and spacing

### 🔌 IoT Integration
- ESP32 device support
- HTTP API for device data ingestion
- Real-time data updates
- Device authentication via API key

## 🏗️ Project Structure

```
smart-iot-dashboard/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── store/           # Zustand state management
│   │   ├── styles/          # Global styles
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── README.md
│
├── backend/                  # Express.js API
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   └── index.js         # Main server file
│   ├── package.json
│   └── README.md
│
├── database/                 # Database setup
│   ├── schema.sql           # Table definitions
│   └── rls-policies.sql     # Security policies
│
├── iot/                      # IoT device code
│   └── esp32_example.ino    # ESP32 Arduino code
│
├── SETUP_GUIDE.md           # Detailed setup instructions
└── README.md                # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn
- Supabase account (free tier available)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/vraj2kk5/SEM4-PROJECT.git
cd SEM4-PROJECT
```

2. **Setup Supabase**
   - Create account at [supabase.com](https://supabase.com)
   - Create new project
   - Run SQL from `database/schema.sql`
   - Get API keys from Project Settings

3. **Setup Frontend**
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
npm run dev
```

4. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
npm run dev
```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 📚 Documentation

- [Frontend README](./frontend/README.md) - Frontend setup and features
- [Backend README](./backend/README.md) - Backend API documentation
- [Setup Guide](./SETUP_GUIDE.md) - Detailed setup instructions
- [Database Schema](./database/schema.sql) - Database structure
- [IoT Integration](./iot/esp32_example.ino) - ESP32 device code

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Recharts** - Charts and graphs
- **Zustand** - State management
- **React Router** - Routing
- **Lucide React** - Icons

### Backend
- **Express.js** - Web framework
- **Node.js** - Runtime
- **Supabase** - Database & Auth
- **Zod** - Schema validation
- **Helmet** - Security headers
- **CORS** - Cross-origin requests

### Database
- **PostgreSQL** - Database (via Supabase)
- **Row Level Security** - Data protection
- **Triggers** - Automated tasks

### Deployment
- **Vercel** - Frontend hosting
- **Railway/Heroku** - Backend hosting
- **Supabase** - Database hosting

## 📊 API Endpoints

### Authentication
```
POST   /api/auth/signup          - Create account
POST   /api/auth/signin          - Login
POST   /api/auth/verify          - Verify token
```

### Dustbin Logs
```
GET    /api/dustbin/logs         - Get all logs
GET    /api/dustbin/logs/:id     - Get single log
POST   /api/dustbin/logs         - Create log
GET    /api/dustbin/stats/monthly - Monthly stats
GET    /api/dustbin/stats/range  - Date range stats
POST   /api/dustbin/device/log   - IoT device endpoint
```

### User Profile
```
GET    /api/profile              - Get profile
PUT    /api/profile              - Update profile
DELETE /api/profile              - Delete account
```

## 🔐 Security Features

- JWT authentication
- Row Level Security (RLS)
- Input validation with Zod
- Protected routes
- CORS protection
- Helmet security headers
- Rate limiting
- Secure password handling
- API key authentication for IoT devices

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: 640px, 768px, 1024px, 1280px
- Touch-friendly interface
- Optimized for all screen sizes

## 🌙 Theme Support

- Light mode (default)
- Dark mode
- Persistent theme preference
- Smooth transitions

## 📈 Performance

- Code splitting
- Lazy loading
- Image optimization
- Database indexing
- Pagination
- Caching strategies
- Efficient re-renders

## 🧪 Testing

### Frontend
```bash
cd frontend
npm run lint
```

### Backend
```bash
cd backend
npm run lint
```

## 🚢 Deployment

### Frontend (Vercel)
```bash
npm run build
vercel deploy
```

### Backend (Railway)
```bash
railway up
```

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed deployment instructions.

## 🔌 IoT Integration

### ESP32 Setup
1. Install Arduino IDE
2. Add ESP32 board support
3. Install required libraries (WiFi, HTTPClient, ArduinoJson)
4. Update WiFi credentials and API configuration
5. Upload `iot/esp32_example.ino` to ESP32

### Device Data Format
```json
{
  "userId": "user-uuid",
  "status": "full",
  "level": 85,
  "apiKey": "your-iot-api-key"
}
```

## 📊 Database Schema

### user_profiles
- id (UUID, PK)
- full_name (TEXT)
- email (TEXT)
- role (TEXT)
- notifications_enabled (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### dustbin_logs
- id (UUID, PK)
- user_id (UUID, FK)
- status (TEXT: 'full' or 'empty')
- level (INTEGER: 0-100)
- created_at (TIMESTAMP)

## 🎨 Customization

### Colors
Edit `frontend/tailwind.config.js`:
```js
colors: {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  // Add more colors
}
```

### Branding
- Update logo in `frontend/src/components/Sidebar.jsx`
- Change app name in `frontend/src/components/Navbar.jsx`
- Modify colors in Tailwind config

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Frontend
npm run dev -- --port 3001

# Backend
PORT=5001 npm run dev
```

**Module not found:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Supabase connection error:**
- Verify `.env` file
- Check Supabase URL and keys
- Ensure project is active

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for more troubleshooting.

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions:
1. Check the documentation
2. Review existing issues on GitHub
3. Create a new issue with detailed information

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Map visualization
- [ ] Multi-device support
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] SMS alerts
- [ ] Machine learning predictions
- [ ] API rate limiting dashboard
- [ ] Audit logs

## 👨‍💻 Author

**Vraj Shah**
- GitHub: [@vraj2kk5](https://github.com/vraj2kk5)
- Email: vrajshah5678@gmail.com

## 🙏 Acknowledgments

- Supabase for backend infrastructure
- React community
- Tailwind CSS
- All open-source contributors

---

**Made with ❤️ for IoT enthusiasts**
