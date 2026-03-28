# Demo Credentials - Smart IoT Dashboard

## 🎯 Testing Phase - No Supabase Required

The application now works completely offline for testing and demo purposes. No Supabase setup needed!

## 📝 Login Credentials

### Primary Demo Account
```
Email:    admin@22026
Password: admin
```

### Alternative Credentials
You can use **ANY email and password** to login:
```
Email:    test@example.com
Password: password123
```

```
Email:    user@demo.com
Password: demo1234
```

## ✅ What Works

- ✅ Login with any credentials
- ✅ Signup with any credentials
- ✅ Dashboard with mock data
- ✅ History page with sample logs
- ✅ Settings page
- ✅ Dark/Light mode toggle
- ✅ All UI features
- ✅ Charts and analytics
- ✅ CSV export
- ✅ Pagination and filtering

## ❌ What Doesn't Work (Requires Supabase)

- ❌ Real data persistence (data resets on refresh)
- ❌ Real IoT device integration
- ❌ Backend API calls
- ❌ Real user authentication
- ❌ Database storage

## 🚀 How to Login

1. Open http://localhost:3000
2. You'll see the login page with demo credentials displayed
3. Enter any email and password
4. Click "Sign In"
5. You'll be logged in with mock data

## 📊 Mock Data Included

The dashboard comes with sample data:
- 10 dustbin logs
- Mix of "full" and "empty" statuses
- Fill levels from 10% to 95%
- Timestamps from 7 hours ago to now

## 🔄 Session Persistence

- User data is saved to browser's localStorage
- Session persists across page refreshes
- Logout clears the session

## 🔐 Security Note

This is a **demo/testing mode only**. For production:
1. Set up Supabase
2. Enable real authentication
3. Configure environment variables
4. Enable Row Level Security (RLS)

See `SETUP_GUIDE.md` for production setup.

## 🎨 Features to Test

### Dashboard
- View total usage count
- See full/empty events
- View charts (line, bar, pie)
- Recent activity feed

### History
- Sortable table
- Filter by status
- Pagination
- CSV export

### Settings
- Change password (mocked)
- Toggle dark/light mode
- Notification preferences

### UI/UX
- Responsive design
- Dark mode
- Smooth animations
- Loading states

## 📱 Testing Checklist

- [ ] Login with admin@22026 / admin
- [ ] View dashboard with charts
- [ ] Check history page
- [ ] Toggle dark mode
- [ ] Try CSV export
- [ ] Test pagination
- [ ] Resize browser (responsive)
- [ ] Logout and login again
- [ ] Try different credentials

## 🐛 Troubleshooting

**Can't login?**
- Check browser console (F12)
- Try refreshing the page
- Clear browser cache

**Data not showing?**
- Refresh the page
- Check if you're logged in
- Try logging out and back in

**Dark mode not working?**
- Click the moon icon in navbar
- Check if it's enabled in settings

## 🔄 Switching to Production

When ready to use real data:

1. **Set up Supabase**
   - Create account at supabase.com
   - Create new project
   - Get API keys

2. **Configure environment**
   - Create `frontend/.env.local`
   - Add Supabase credentials

3. **Set up database**
   - Run SQL from `database/schema.sql`
   - Enable RLS policies

4. **Update code**
   - Remove mock data service
   - Use real Supabase client
   - Enable backend API

See `SETUP_GUIDE.md` for detailed instructions.

## 📞 Support

For issues:
1. Check the documentation
2. Review browser console errors
3. Try clearing cache and refreshing
4. Check GitHub issues

---

**Happy Testing! 🎉**
