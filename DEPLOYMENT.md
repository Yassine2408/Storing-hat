# 🚀 Deployment Guide

## Important Notes

**Netlify can only host the admin dashboard (HTML/CSS/JS), NOT the Discord bot itself.**

Discord bots need to:
- Run continuously (24/7)
- Maintain WebSocket connections
- Run Node.js server code

Netlify is for static websites only. You need a different service for the bot.

## Deployment Options

### Option 1: Railway (Recommended - Free Tier Available)
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect Node.js
6. Add environment variable: `DISCORD_BOT_TOKEN=your-token`
7. Deploy!

**Railway gives you $5 free credit monthly - enough for a small bot!**

### Option 2: Render (Free Tier Available)
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repo
5. Settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Node
6. Add environment variable: `DISCORD_BOT_TOKEN`
7. Deploy!

**Render free tier: spins down after 15 min inactivity, but auto-wakes on request**

### Option 3: Replit (Always Free)
1. Go to [replit.com](https://replit.com)
2. Create new Repl → "Import from GitHub"
3. Select your repo
4. Add Secrets: `DISCORD_BOT_TOKEN`
5. Click "Run" button
6. Enable "Always On" (requires Replit subscription or use UptimeRobot)

### Option 4: Keep It Running Locally (Free)
Use a process manager to keep it running:

**Windows:**
- Use Task Scheduler to run on startup
- Or use PM2: `npm install -g pm2` then `pm2 start bot.js`

## Hosting the Admin Dashboard on Netlify

1. Go to [netlify.com](https://netlify.com)
2. Sign up/login
3. Drag and drop the `admin.html` file OR connect GitHub
4. Deploy!

**Important:** Update the API URL in the dashboard to point to your bot's hosted URL (e.g., `https://your-bot.railway.app`)

## Configuration

### For Railway/Render:
1. Set environment variable: `PORT=3000` (or let it auto-assign)
2. Set environment variable: `DISCORD_BOT_TOKEN=your-token`
3. Update admin.html API URL to: `https://your-app.railway.app` or `https://your-app.onrender.com`

### For Local Development:
1. Bot runs on: `http://localhost:3000`
2. Open `admin.html` in browser
3. Set API URL to: `http://localhost:3000`

## Testing

1. Deploy bot to Railway/Render
2. Deploy admin.html to Netlify
3. Update API URL in admin dashboard
4. Test start/stop/status from the dashboard!

## Troubleshooting

**Bot won't start:**
- Check environment variables are set
- Check bot token is valid
- Check logs in Railway/Render dashboard

**Dashboard can't connect:**
- Verify bot API URL is correct
- Check CORS is enabled (already done in code)
- Check bot is actually running

**Bot goes offline:**
- Free tiers may have limitations
- Check service status page
- Consider upgrading to paid tier for 24/7 uptime

