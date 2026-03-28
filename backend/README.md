# Smart IoT Dashboard - Backend API

Express.js backend API for the Smart IoT Dashboard with Supabase integration.

## Features

- 🔐 **JWT Authentication** - Secure token-based auth
- 📊 **RESTful API** - Clean, well-documented endpoints
- 🛡️ **Security** - Helmet, CORS, rate limiting
- 📈 **Statistics** - Monthly and date-range analytics
- 🔌 **IoT Integration** - Device data ingestion
- ✅ **Input Validation** - Zod schema validation
- 📝 **Error Handling** - Comprehensive error responses

## Tech Stack

- **Express.js** - Web framework
- **Supabase** - Database & Auth
- **Zod** - Schema validation
- **Helmet** - Security headers
- **CORS** - Cross-origin requests
- **Rate Limiting** - Request throttling

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
```bash
git clone https://github.com/vraj2kk5/SEM4-PROJECT.git
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file
```bash
cp .env.example .env
```

4. Add your Supabase credentials
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
FRONTEND_URL=http://localhost:3000
IOT_API_KEY=your-iot-api-key
```

5. Start development server
```bash
npm run dev
```

The API will run on `http://localhost:5000`

## Project Structure

```
src/
├── routes/              # API routes
│   ├── auth.js         # Authentication endpoints
│   ├── dustbin.js      # Dustbin log endpoints
│   └── profile.js      # User profile endpoints
├── middleware/          # Custom middleware
│   └── auth.js         # Token verification
└── index.js            # Main app file
```

## API Endpoints

### Authentication

#### Sign Up
```
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

#### Sign In
```
POST /api/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Verify Token
```
POST /api/auth/verify
Authorization: Bearer <token>
```

### Dustbin Logs

#### Get All Logs
```
GET /api/dustbin/logs?limit=100&offset=0
Authorization: Bearer <token>
```

#### Get Log by ID
```
GET /api/dustbin/logs/:id
Authorization: Bearer <token>
```

#### Create Log
```
POST /api/dustbin/logs
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "full",
  "level": 85
}
```

#### Get Monthly Statistics
```
GET /api/dustbin/stats/monthly
Authorization: Bearer <token>
```

#### Get Statistics by Date Range
```
GET /api/dustbin/stats/range?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

#### IoT Device Log (No Auth Required)
```
POST /api/dustbin/device/log
Content-Type: application/json

{
  "userId": "user-uuid",
  "status": "full",
  "level": 90,
  "apiKey": "your-iot-api-key"
}
```

### User Profile

#### Get Profile
```
GET /api/profile
Authorization: Bearer <token>
```

#### Update Profile
```
PUT /api/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name": "John Doe",
  "notifications_enabled": true
}
```

#### Delete Account
```
DELETE /api/profile
Authorization: Bearer <token>
```

## Database Schema

### dustbin_logs
```sql
CREATE TABLE dustbin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('full', 'empty')),
  level INTEGER NOT NULL CHECK (level >= 0 AND level <= 100),
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_dustbin_logs_user_id ON dustbin_logs(user_id);
CREATE INDEX idx_dustbin_logs_created_at ON dustbin_logs(created_at);
```

### user_profiles
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

## Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE dustbin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- dustbin_logs policies
CREATE POLICY "Users can view their own logs"
  ON dustbin_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own logs"
  ON dustbin_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- user_profiles policies
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);
```

## Environment Variables

```
NODE_ENV              - Environment (development/production)
PORT                  - Server port (default: 5000)
SUPABASE_URL          - Supabase project URL
SUPABASE_SERVICE_KEY  - Supabase service role key
FRONTEND_URL          - Frontend URL for CORS
IOT_API_KEY           - API key for IoT devices
```

## Error Handling

All errors return JSON with status code and message:

```json
{
  "error": "Error message",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Security Features

- JWT token verification
- Row Level Security (RLS)
- Input validation with Zod
- CORS protection
- Helmet security headers
- Rate limiting (100 requests per 15 minutes)
- Service key for admin operations

## IoT Integration

ESP32 devices can send data to the `/api/dustbin/device/log` endpoint:

```cpp
#include <WiFi.h>
#include <HTTPClient.h>

void sendDustbinData(String userId, String status, int level) {
  HTTPClient http;
  http.begin("http://your-api.com/api/dustbin/device/log");
  http.addHeader("Content-Type", "application/json");
  
  String payload = "{\"userId\":\"" + userId + "\",\"status\":\"" + status + "\",\"level\":" + level + ",\"apiKey\":\"your-iot-api-key\"}";
  
  int httpCode = http.POST(payload);
  http.end();
}
```

## Performance Optimization

- Database indexing on frequently queried columns
- Pagination for large datasets
- Rate limiting to prevent abuse
- Efficient query patterns

## Deployment

### Heroku
```bash
git push heroku main
```

### Railway
```bash
railway up
```

### Vercel (with serverless functions)
```bash
vercel deploy
```

## Testing

```bash
# Test health endpoint
curl http://localhost:5000/health

# Test authentication
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
