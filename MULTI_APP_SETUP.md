# Multi-App VPS Setup Guide

## 🎯 Running FitBite with Other Apps

Since you have multiple apps on your VPS, here's how to set up FitBite without conflicts:

## 📋 **Port Configuration (Updated)**

Your FitBite app now uses these ports:
- **App**: `localhost:3001` (instead of 3000)
- **Database**: `localhost:5433` (instead of 5432)
- **Redis**: `localhost:6380` (instead of 6379)
- **Nginx**: `localhost:8080` and `localhost:8443` (or use host nginx)

## 🔧 **Option 1: Use Host Nginx (Recommended)**

### Step 1: Remove Docker Nginx
Edit your `docker-compose.yml` and comment out the nginx service:

```yaml
# Comment out or remove this entire section:
# nginx:
#   image: nginx:alpine
#   container_name: fitbite-nginx
#   ...
```

### Step 2: Configure Host Nginx

Add this to your main nginx config (usually `/etc/nginx/sites-available/`):

```nginx
# Add to your existing nginx.conf or create new site file
server {
    listen 80;
    server_name fitbite.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name fitbite.yourdomain.com;

    # Your SSL certificate paths
    ssl_certificate /etc/letsencrypt/live/fitbite.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/fitbite.yourdomain.com/privkey.pem;

    # Proxy to FitBite Docker container
    location / {
        proxy_pass http://localhost:3001;
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
```

### Step 3: Enable the Site
```bash
# Link the configuration
ln -s /etc/nginx/sites-available/fitbite /etc/nginx/sites-enabled/

# Test nginx configuration
nginx -t

# Reload nginx
systemctl reload nginx
```

## 🔧 **Option 2: Use Docker Nginx on Different Ports**

If you want to keep Docker nginx, your app will be available on:
- **HTTP**: `http://yourdomain.com:8080`
- **HTTPS**: `https://yourdomain.com:8443`

## 🚀 **Deployment Commands**

### For Host Nginx Setup:
```bash
# Deploy without Docker nginx
docker-compose up -d fitbite-app postgres redis

# Or modify docker-compose.yml to exclude nginx service
```

### For Docker Nginx Setup:
```bash
# Deploy everything (uses ports 8080/8443)
./deploy.sh deploy
```

## 🔍 **Check Your Setup**

```bash
# Check what's running on which ports
netstat -tulpn | grep LISTEN

# Should show:
# :3001 (FitBite app)
# :5433 (PostgreSQL)
# :6380 (Redis)
# :80 and :443 (Your main nginx)
```

## 🌐 **Domain Setup Options**

### Option A: Subdomain
- **FitBite**: `fitbite.yourdomain.com`
- **Other apps**: `app2.yourdomain.com`, `app3.yourdomain.com`

### Option B: Different domains
- **FitBite**: `yourdomain.com`
- **Other apps**: `anotherdomain.com`

### Option C: Path-based
- **FitBite**: `yourdomain.com/fitbite`
- **Other apps**: `yourdomain.com/app2`

## 🛠️ **Easy Setup Commands**

### Quick Setup with Host Nginx:
```bash
# 1. Deploy FitBite containers (without nginx)
docker-compose up -d fitbite-app postgres redis

# 2. Add nginx config to host
sudo nano /etc/nginx/sites-available/fitbite

# 3. Enable site
sudo ln -s /etc/nginx/sites-available/fitbite /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 4. Get SSL certificate for subdomain
sudo certbot --nginx -d fitbite.yourdomain.com
```

## ✅ **Testing Your Setup**

1. **Check containers**: `docker ps`
2. **Test app directly**: `curl http://localhost:3001/health`
3. **Test through nginx**: `curl https://fitbite.yourdomain.com/health`

## 🆘 **Troubleshooting**

### Port conflicts?
```bash
# Check what's using ports
sudo lsof -i :80
sudo lsof -i :3001
sudo lsof -i :5432

# Kill conflicting processes if needed
sudo kill -9 PID_NUMBER
```

### Nginx errors?
```bash
# Check nginx config
sudo nginx -t

# Check nginx logs
sudo tail -f /var/log/nginx/error.log
```

This setup allows FitBite to run alongside your other apps without conflicts! 🎉