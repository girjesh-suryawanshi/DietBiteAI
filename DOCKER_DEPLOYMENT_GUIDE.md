# FitBite Docker Deployment Guide for Hostinger VPS

## 📋 Complete Step-by-Step Tutorial

This guide will walk you through deploying your FitBite app on Hostinger VPS using Docker, like a teacher would explain to a student. Follow each step carefully!

---

## 🎯 What We're Going to Do

1. **Prepare your Hostinger VPS server**
2. **Install Docker and required tools**
3. **Set up your application files**
4. **Configure environment variables**
5. **Deploy using Docker**
6. **Set up SSL and domain**
7. **Monitor and maintain your app**

---

## 📋 Prerequisites

Before we start, make sure you have:
- ✅ Hostinger VPS account with root access
- ✅ A domain name pointed to your VPS IP
- ✅ Basic command line knowledge
- ✅ Your API keys ready (Gemini/OpenAI, Firebase, Database)

---

## 🖥️ Step 1: Prepare Your Hostinger VPS

### 1.1 Connect to Your VPS

```bash
# Replace 'your-server-ip' with your actual VPS IP address
ssh root@your-server-ip

# Or if you have a non-root user:
ssh username@your-server-ip
```

### 1.2 Update Your System

```bash
# Update package list
apt update

# Upgrade existing packages
apt upgrade -y

# Install essential tools
apt install -y curl wget git unzip nano htop
```

### 1.3 Create a Dedicated User (Security Best Practice)

```bash
# Create a new user for the application
adduser fitbite

# Add user to sudo group
usermod -aG sudo fitbite

# Switch to the new user
su - fitbite
```

---

## 🐳 Step 2: Install Docker and Docker Compose

### 2.1 Install Docker

```bash
# Remove any old Docker installations
sudo apt remove docker docker-engine docker.io containerd runc

# Install prerequisites
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update package list
sudo apt update

# Install Docker
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Add current user to docker group
sudo usermod -aG docker $USER

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker
```

### 2.2 Install Docker Compose

```bash
# Download Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make it executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### 2.3 Test Docker Installation

```bash
# Test Docker (this should work without sudo)
docker run hello-world

# If the above fails, log out and log back in, then try again
```

---

## 📁 Step 3: Upload Your Application Files

### Option A: Using Git (Recommended)

```bash
# Create application directory
mkdir -p /home/fitbite/app
cd /home/fitbite/app

# Clone your repository (replace with your actual repository URL)
git clone https://github.com/your-username/fitbite.git .

# Or if you don't have a Git repository, proceed to Option B
```

### Option B: Using File Upload

1. **Zip your entire FitBite project** on your local machine
2. **Upload via Hostinger File Manager** or SCP:

```bash
# From your local machine, upload the zip file
scp fitbite.zip fitbite@your-server-ip:/home/fitbite/

# On the server, extract the files
cd /home/fitbite
unzip fitbite.zip
mv fitbite-main app  # Adjust folder name as needed
cd app
```

### 3.1 Verify Files Are Uploaded

```bash
# Check if all Docker files are present
ls -la

# You should see:
# - Dockerfile
# - docker-compose.yml
# - .dockerignore
# - nginx.conf
# - deploy.sh
# - .env.example
```

---

## 🔐 Step 4: Configure Environment Variables

### 4.1 Create Your Environment File

```bash
# Copy the example file
cp .env.example .env

# Edit the environment file
nano .env
```

### 4.2 Fill in Your Configuration

Replace the following values in the `.env` file:

```bash
# Application
NODE_ENV=production
PORT=5000

# Your OpenAI API Key
OPENAI_API_KEY=sk-your-actual-openai-key-here

# Your Gemini API Key  
GEMINI_API_KEY=your-actual-gemini-key-here

# Your Firebase Configuration
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_APP_ID=your-firebase-app-id

# Your Database URL (Neon or your PostgreSQL)
DATABASE_URL=postgresql://username:password@hostname:port/database

# Your Domain
DOMAIN=yourdomain.com

# Generate a random session secret (use a long random string)
SESSION_SECRET=your-very-long-random-secret-key-here-make-it-very-long

# Other settings (you can keep these as default)
REDIS_URL=redis://redis:6379
CORS_ORIGIN=https://yourdomain.com
```

**💡 How to Get Your API Keys:**

1. **OpenAI API Key**: Go to https://platform.openai.com/api-keys
2. **Gemini API Key**: Go to https://makersuite.google.com/app/apikey
3. **Firebase Config**: Go to your Firebase project settings
4. **Database URL**: From your Neon.tech dashboard or your PostgreSQL setup

### 4.3 Save and Exit

```bash
# Save the file in nano: Ctrl+X, then Y, then Enter
```

---

## 🚀 Step 5: Deploy Your Application

### 5.1 Update Domain in Configuration

```bash
# Edit the docker-compose.yml file
nano docker-compose.yml

# Find this line and replace 'yourdomain.com' with your actual domain:
# - "traefik.http.routers.fitbite.rule=Host(`yourdomain.com`)"

# Also edit nginx.conf
nano nginx.conf

# Find and replace 'yourdomain.com' with your actual domain in these lines:
# server_name yourdomain.com www.yourdomain.com;
```

### 5.2 Make Deploy Script Executable

```bash
# Make the deployment script executable (if not already)
chmod +x deploy.sh
```

### 5.3 Deploy the Application

```bash
# Run the deployment script
./deploy.sh deploy

# This will:
# 1. Check system requirements
# 2. Create a backup
# 3. Build Docker images
# 4. Start all containers
# 5. Perform health checks
```

### 5.4 Check Deployment Status

```bash
# Check if containers are running
docker-compose ps

# Check application logs
./deploy.sh logs

# Check system resources
./deploy.sh status
```

---

## 🌐 Step 6: Configure Domain and Firewall

### 6.1 Configure Firewall

```bash
# Install UFW (Ubuntu Firewall)
sudo apt install ufw

# Allow SSH (important - don't lock yourself out!)
sudo ufw allow ssh
sudo ufw allow 22

# Allow HTTP and HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Allow custom port if needed
sudo ufw allow 3001

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### 6.2 Test Your Application

```bash
# Test locally first
curl http://localhost:80

# Test from outside (replace with your domain or IP)
curl http://your-domain.com
```

---

## 🔒 Step 7: Set Up SSL Certificate (HTTPS)

### 7.1 Install Certbot

```bash
# Install Certbot
sudo apt install snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot

# Create symlink
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

### 7.2 Get SSL Certificate

```bash
# Stop nginx temporarily
docker-compose stop nginx

# Get certificate (replace with your domain)
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Certificates will be saved to: /etc/letsencrypt/live/yourdomain.com/
```

### 7.3 Configure SSL in Nginx

```bash
# Create SSL directory
mkdir -p ssl

# Copy certificates (replace yourdomain.com with your actual domain)
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ssl/certificate.crt
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ssl/private.key

# Change ownership
sudo chown -R fitbite:fitbite ssl/

# Edit nginx configuration
nano nginx.conf

# Uncomment the SSL configuration lines:
# - Uncomment the HTTP to HTTPS redirect server block
# - Uncomment the SSL configuration in the main server block
# - Update the domain names

# Restart nginx
docker-compose restart nginx
```

### 7.4 Test HTTPS

```bash
# Test HTTPS
curl https://yourdomain.com

# Check SSL certificate
curl -vI https://yourdomain.com
```

---

## 🔧 Step 8: Ongoing Maintenance

### 8.1 Useful Commands

```bash
# View application logs
./deploy.sh logs

# Check application status
./deploy.sh status

# Restart the application
./deploy.sh restart

# Stop the application
./deploy.sh stop

# Start the application
./deploy.sh start

# Deploy updates
./deploy.sh deploy

# Rollback to previous version
./deploy.sh rollback

# Clean up old Docker images
./deploy.sh cleanup
```

### 8.2 Monitor Your Application

```bash
# Check disk usage
df -h

# Check memory usage
free -h

# Check running processes
htop

# View Docker container logs
docker logs fitbite-app

# Check Docker container stats
docker stats
```

### 8.3 Database Backup (Important!)

```bash
# Create a backup script
nano backup-db.sh

# Add this content:
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="db_backup_$TIMESTAMP.sql"

# Replace with your actual database connection details
pg_dump "$DATABASE_URL" > "$BACKUP_FILE"
echo "Database backed up to: $BACKUP_FILE"

# Make it executable
chmod +x backup-db.sh

# Run backup
./backup-db.sh
```

### 8.4 Auto-renewal of SSL Certificates

```bash
# Add crontab entry for auto-renewal
sudo crontab -e

# Add this line to renew certificates every 2 months:
0 12 * */2 * /usr/bin/certbot renew --quiet && docker-compose restart nginx
```

---

## 🔍 Troubleshooting Common Issues

### Issue 1: Application Won't Start

```bash
# Check Docker logs
docker-compose logs fitbite-app

# Check if environment variables are set correctly
docker-compose exec fitbite-app env | grep -i api

# Restart the application
./deploy.sh restart
```

### Issue 2: Database Connection Issues

```bash
# Test database connection
docker-compose exec fitbite-app node -e "console.log(process.env.DATABASE_URL)"

# Check if DATABASE_URL is correct in .env file
cat .env | grep DATABASE_URL
```

### Issue 3: SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Manually renew certificate
sudo certbot renew

# Test SSL configuration
curl -vI https://yourdomain.com
```

### Issue 4: Memory Issues

```bash
# Check available memory
free -h

# If low on memory, you can add swap:
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make swap permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## ✅ Final Checklist

Before considering your deployment complete, verify:

- [ ] ✅ Application loads at `https://yourdomain.com`
- [ ] ✅ User registration/login works
- [ ] ✅ Meal plan generation works
- [ ] ✅ PDF download works
- [ ] ✅ SSL certificate is valid (green lock in browser)
- [ ] ✅ Firebase authentication is configured
- [ ] ✅ Database is connected and working
- [ ] ✅ All API keys are working
- [ ] ✅ Automatic backups are configured
- [ ] ✅ SSL auto-renewal is set up

---

## 🎉 Congratulations!

Your FitBite application is now successfully deployed on Hostinger VPS with Docker! 

### What You've Achieved:

✅ **Secure Production Environment**: Your app runs in isolated Docker containers  
✅ **SSL Security**: HTTPS encryption protects user data  
✅ **Automatic Backups**: Your data is protected with regular backups  
✅ **Easy Updates**: Use `./deploy.sh deploy` to update your app  
✅ **Professional Setup**: Nginx reverse proxy for optimal performance  
✅ **Monitoring Tools**: Built-in health checks and logging  

### Next Steps:

1. **Test thoroughly**: Go through all features of your app
2. **Monitor performance**: Keep an eye on server resources
3. **Regular updates**: Deploy updates using the deployment script
4. **User feedback**: Collect user feedback and iterate

### Need Help?

If you encounter any issues, check the troubleshooting section above or:
- Check application logs: `./deploy.sh logs`
- Check container status: `./deploy.sh status`
- Restart if needed: `./deploy.sh restart`

**Your FitBite app is now live and helping users with their nutrition goals! 🍏💪**

---

## 📞 Support Commands Quick Reference

```bash
# Essential maintenance commands
./deploy.sh status      # Check app status
./deploy.sh logs        # View logs
./deploy.sh restart     # Restart app
./deploy.sh deploy      # Deploy updates
./deploy.sh rollback    # Rollback changes

# Docker commands
docker-compose ps       # List containers
docker-compose logs     # View all logs
docker system prune     # Clean up Docker

# System monitoring
htop                    # System resources
df -h                   # Disk usage
free -h                 # Memory usage
```

Remember: Always backup your data before making changes! 🔒