# PostgreSQL Setup Guide for FitBite

## 🎯 What You Get

Your FitBite app now uses **real PostgreSQL database** that:
- ✅ **Saves data permanently** (no data loss on restart)
- ✅ **Runs in Docker container** (easy to manage)
- ✅ **Automatic setup** (no manual database creation)
- ✅ **Built-in backups** (data is safe)

## 🚀 Simple Setup Steps

### Step 1: Set Your Database Password

```bash
# Copy the example environment file
cp .env.example .env

# Edit the file
nano .env
```

**Important:** Change this line in your `.env` file:
```bash
DB_PASSWORD=your_secure_password_here
```

**Replace with a strong password like:**
```bash
DB_PASSWORD=MySecurePassword123!
```

### Step 2: Deploy Your App

```bash
# Deploy with PostgreSQL
./deploy.sh deploy
```

**What happens:**
1. 🐘 PostgreSQL container starts
2. 📊 Database tables are created automatically
3. 🚀 Your app connects to the database
4. ✅ Everything works together!

### Step 3: Verify It's Working

```bash
# Check if database is running
./deploy.sh status

# You should see:
# ✅ fitbite-postgres ... Up (healthy)
# ✅ fitbite-app ... Up
```

## 🔍 How to Check Your Data

### View Database Status
```bash
# Check PostgreSQL logs
docker logs fitbite-postgres

# Connect to database (optional)
docker exec -it fitbite-postgres psql -U fitbite_user -d fitbite
```

### Test Your App
1. **Create a user account** on your app
2. **Generate a meal plan**
3. **Restart the app**: `./deploy.sh restart`
4. **Check if data is still there** ✅

## 🆘 Troubleshooting

### Database Won't Start?
```bash
# Check logs
docker logs fitbite-postgres

# Common fix: Check your password in .env file
cat .env | grep DB_PASSWORD
```

### App Can't Connect to Database?
```bash
# Check if DATABASE_URL is correct in .env
cat .env | grep DATABASE_URL

# Should look like:
# DATABASE_URL=postgresql://fitbite_user:YourPassword@postgres:5432/fitbite
```

### Data is Missing?
```bash
# Check if containers are running
docker ps

# Restart everything
./deploy.sh restart
```

## 📊 Database Information

**Your database details:**
- **Database Name**: fitbite
- **Username**: fitbite_user
- **Password**: (what you set in .env)
- **Port**: 5432
- **Host**: postgres (inside Docker)

**Tables created automatically:**
- `users` - User profiles and preferences
- `meal_plans` - Generated meal plans
- `pdf_files` - PDF download records

## 🔄 Backup Your Data

### Automatic Backup (Recommended)
```bash
# This creates backup before each deployment
./deploy.sh deploy
```

### Manual Backup
```bash
# Create manual backup
docker exec fitbite-postgres pg_dump -U fitbite_user fitbite > backup.sql

# Restore from backup
cat backup.sql | docker exec -i fitbite-postgres psql -U fitbite_user -d fitbite
```

## ✅ You're All Set!

Your FitBite app now has:
- 🐘 **PostgreSQL database** running in Docker
- 💾 **Permanent data storage** (no more data loss!)
- 🔄 **Automatic backups** with deployments
- 🛡️ **Secure setup** with password protection

**Your users can now:**
- Create accounts that persist
- Generate meal plans that are saved
- Download PDFs anytime
- Come back and see their data

## 🎉 Next Steps

1. **Test your app thoroughly**
2. **Create some test accounts**
3. **Generate meal plans**
4. **Restart and verify data persists**
5. **You're ready for production!**

No more worrying about losing user data! 🎯