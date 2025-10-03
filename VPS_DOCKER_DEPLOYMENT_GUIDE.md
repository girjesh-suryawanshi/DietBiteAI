# MyMealify VPS Docker Deployment Guide

## Prerequisites

- VPS with Ubuntu 20.04+ or Debian 11+
- Minimum 2GB RAM, 2 CPU cores
- Domain name pointed to your VPS IP (optional but recommended for SSL)
- SSH access to your VPS

## Step 1: Prepare Your VPS

### 1.1 Connect to VPS
```bash
ssh root@your-vps-ip
```

### 1.2 Update System
```bash
apt update && apt upgrade -y
```

### 1.3 Install Docker
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose-plugin -y

# Verify installation
docker --version
docker compose version
```

### 1.4 Create Application User (Optional but Recommended)
```bash
adduser mymealify
usermod -aG docker mymealify
usermod -aG sudo mymealify
su - mymealify
```

## Step 2: Transfer Application Files to VPS

### Option A: Using Git (Recommended)
```bash
# On VPS
cd /home/mymealify
git clone https://github.com/your-username/mymealify.git
cd mymealify
```

### Option B: Using SCP from Your Local Machine
```bash
# On your local machine
tar -czf mymealify.tar.gz .
scp mymealify.tar.gz mymealify@your-vps-ip:/home/mymealify/

# On VPS
cd /home/mymealify
tar -xzf mymealify.tar.gz
rm mymealify.tar.gz
```

### Option C: Using rsync (Best for Updates)
```bash
# On your local machine
rsync -avz --exclude 'node_modules' --exclude 'dist' --exclude '.git' \
  ./ mymealify@your-vps-ip:/home/mymealify/app/
```

## Step 3: Configure Environment Variables

### 3.1 Create .env File on VPS
```bash
cd /home/mymealify/mymealify
nano .env
```

### 3.2 Add Environment Variables
```env
# Node Environment
NODE_ENV=production
PORT=5000

# API Keys
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# Database Configuration (PostgreSQL)
DATABASE_URL=postgresql://mymealify_user:your_secure_password@postgres:5432/mymealify
DB_NAME=mymealify
DB_USER=mymealify_user
DB_PASSWORD=your_secure_password_here

# Redis Configuration (Optional)
REDIS_URL=redis://redis:6379
```

**Save and exit:** Press `Ctrl+X`, then `Y`, then `Enter`

### 3.3 Secure the .env File
```bash
chmod 600 .env
```

## Step 4: Build and Deploy with Docker

### 4.1 Build the Docker Images
```bash
docker compose build --no-cache
```

### 4.2 Start the Application
```bash
docker compose up -d
```

### 4.3 Verify Containers are Running
```bash
docker compose ps
```

You should see:
- mymealify-app (running)
- mymealify-nginx (running)
- mymealify-postgres (running)
- mymealify-redis (running)

### 4.4 Check Logs
```bash
# View all logs
docker compose logs -f

# View specific service logs
docker compose logs -f mymealify-app
docker compose logs -f nginx
docker compose logs -f postgres
```

## Step 5: Configure Firewall

```bash
# Allow SSH
ufw allow 22/tcp

# Allow HTTP and HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Allow custom ports (if using)
ufw allow 8080/tcp
ufw allow 8443/tcp

# Enable firewall
ufw enable
ufw status
```

## Step 6: Set Up SSL with Let's Encrypt (Optional but Recommended)

### 6.1 Install Certbot
```bash
apt install certbot python3-certbot-nginx -y
```

### 6.2 Stop Nginx Container Temporarily
```bash
docker compose stop nginx
```

### 6.3 Get SSL Certificate
```bash
certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com
```

### 6.4 Copy Certificates to SSL Directory
```bash
mkdir -p /home/mymealify/mymealify/ssl
cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem /home/mymealify/mymealify/ssl/
cp /etc/letsencrypt/live/yourdomain.com/privkey.pem /home/mymealify/mymealify/ssl/
```

### 6.5 Update nginx.conf for SSL
Edit the `nginx.conf` file to include SSL configuration:
```bash
nano nginx.conf
```

Add SSL server block:
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    
    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://mymealify-app:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

### 6.6 Restart Nginx
```bash
docker compose up -d nginx
```

### 6.7 Set Up Auto-Renewal
```bash
# Test renewal
certbot renew --dry-run

# Add renewal cron job
crontab -e
```

Add this line:
```
0 3 * * * certbot renew --quiet --post-hook "docker compose -f /home/mymealify/mymealify/docker-compose.yml restart nginx"
```

## Step 7: Verify Deployment

### 7.1 Test Application
```bash
# Test from VPS
curl http://localhost:3002/health

# Or if using Nginx on port 80/443
curl http://localhost:80
```

### 7.2 Access from Browser
Open your browser and visit:
- `http://your-vps-ip:3002` (direct app access)
- `http://your-vps-ip:8080` (via Nginx)
- `https://yourdomain.com` (with SSL configured)

## Step 8: Database Initialization

### 8.1 Initialize Database Schema
```bash
# Run migration/initialization
docker compose exec mymealify-app npm run db:push
```

### 8.2 Verify Database
```bash
# Access PostgreSQL
docker compose exec postgres psql -U mymealify_user -d mymealify

# Inside PostgreSQL, check tables
\dt
\q
```

## Step 9: Monitoring and Maintenance

### 9.1 View Real-time Logs
```bash
# All services
docker compose logs -f --tail=100

# Specific service
docker compose logs -f mymealify-app --tail=100
```

### 9.2 Restart Services
```bash
# Restart all services
docker compose restart

# Restart specific service
docker compose restart mymealify-app
```

### 9.3 Stop Services
```bash
docker compose stop
```

### 9.4 Update Application
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker compose down
docker compose build --no-cache
docker compose up -d
```

### 9.5 Backup Database
```bash
# Create backup directory
mkdir -p /home/mymealify/backups

# Backup PostgreSQL
docker compose exec postgres pg_dump -U mymealify_user mymealify > /home/mymealify/backups/mymealify_$(date +%Y%m%d_%H%M%S).sql
```

### 9.6 Restore Database
```bash
# Restore from backup
docker compose exec -T postgres psql -U mymealify_user -d mymealify < /home/mymealify/backups/mymealify_20250103_120000.sql
```

## Step 10: Performance Optimization

### 10.1 Resource Limits (Optional)
Edit `docker-compose.yml` to add resource limits:
```yaml
services:
  mymealify-app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

### 10.2 Enable Gzip in Nginx
Already configured in the provided `nginx.conf`

## Troubleshooting

### Container Won't Start
```bash
# Check logs
docker compose logs mymealify-app

# Check container status
docker compose ps

# Rebuild
docker compose down
docker compose build --no-cache
docker compose up -d
```

### Port Already in Use
```bash
# Find process using port
lsof -i :3002

# Kill process
kill -9 <PID>

# Or change port in docker-compose.yml
```

### Database Connection Issues
```bash
# Check PostgreSQL is running
docker compose ps postgres

# Check database logs
docker compose logs postgres

# Verify connection string in .env
```

### Out of Memory
```bash
# Check memory usage
docker stats

# Increase VPS memory or add resource limits
```

### SSL Certificate Issues
```bash
# Renew certificates
certbot renew

# Check certificate expiry
certbot certificates
```

## Common Commands Cheat Sheet

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# Rebuild and restart
docker compose up -d --build

# View logs
docker compose logs -f

# Access app container shell
docker compose exec mymealify-app sh

# Access database
docker compose exec postgres psql -U mymealify_user -d mymealify

# Restart single service
docker compose restart mymealify-app

# Check resource usage
docker stats

# Remove all containers and volumes (⚠️ DANGEROUS)
docker compose down -v
```

## Security Best Practices

1. ✅ Always use strong passwords for database
2. ✅ Keep `.env` file secure (chmod 600)
3. ✅ Run containers as non-root user
4. ✅ Enable firewall (ufw)
5. ✅ Use SSL/TLS certificates
6. ✅ Regularly update Docker images
7. ✅ Monitor logs for suspicious activity
8. ✅ Keep system packages updated
9. ✅ Backup database regularly
10. ✅ Use private networks for service communication

## Production Checklist

- [ ] VPS set up with Docker installed
- [ ] Application files transferred to VPS
- [ ] .env file configured with all secrets
- [ ] Docker containers built and running
- [ ] Firewall configured
- [ ] SSL certificate installed (if using domain)
- [ ] Database initialized and tested
- [ ] Application accessible from browser
- [ ] Logs monitored for errors
- [ ] Backup strategy in place
- [ ] Monitoring tools set up (optional: Prometheus, Grafana)

## Support

If you encounter issues:
1. Check logs: `docker compose logs -f`
2. Verify environment variables in `.env`
3. Ensure all containers are running: `docker compose ps`
4. Check firewall settings: `ufw status`
5. Verify DNS settings if using domain

---

**Congratulations! 🎉** Your MyMealify application is now deployed on your VPS with Docker!

Access your application at:
- Direct: `http://your-vps-ip:3002`
- Nginx: `http://your-vps-ip:8080`
- Domain (with SSL): `https://yourdomain.com`
