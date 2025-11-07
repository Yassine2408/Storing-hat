# 🚂 Railway Deployment - Quick Guide

## ✅ Railway is FREE!

**Railway offers:**
- **$5 free credit per month** (enough for a Discord bot!)
- No credit card required
- Pay-as-you-go after free credit (very cheap)

**For a Discord bot, you'll likely use $0-2/month** - well within the free tier!

## 🚀 Quick Deployment Steps

### 1. Push to GitHub

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Sorting Hat Bot with Admin Dashboard"

# Create repo on GitHub.com, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Railway

1. **Go to [railway.app](https://railway.app)** and sign up with GitHub
2. **Click "New Project"** → **"Deploy from GitHub repo"**
3. **Select your repository**
4. **Add Environment Variable:**
   - Go to your project → Variables tab
   - Add: `DISCORD_BOT_TOKEN` = `your-bot-token-here`
5. **Railway auto-detects Node.js and deploys!** (takes 2-3 minutes)

### 3. Get Your Bot URL

- Railway dashboard → Your service → Settings → Networking
- Copy the public URL (e.g., `your-bot.up.railway.app`)
- Update admin dashboard API URL to this URL

## 📊 Monitoring

- **View Logs**: Railway dashboard → Deployments → View Logs
- **Check Status**: Green = running, Red = error
- **Restart**: Click "Redeploy" button

## 💰 Cost Management

- Check usage in Railway dashboard → Usage tab
- Set spending limits in settings
- Discord bots typically cost $0-2/month (free tier covers it!)

## 🎉 Done!

Your bot will now run 24/7 on Railway! The free $5/month credit is more than enough.

