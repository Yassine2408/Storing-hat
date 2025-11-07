# 🚂 Railway Deployment Guide

## Railway Pricing

**Good News!** Railway offers:
- **$5 free credit per month** (enough for a small Discord bot)
- Pay-as-you-go after that (very affordable)
- No credit card required for free tier!

For a Discord bot, $5/month is usually more than enough. You'll only pay if you exceed the free credit.

## Step-by-Step Deployment

### Step 1: Push to GitHub

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Sorting Hat Bot"
   ```

2. **Create GitHub Repository**:
   - Go to [github.com](https://github.com)
   - Click "New Repository"
   - Name it (e.g., "sorting-hat-bot")
   - Don't initialize with README (we already have one)
   - Click "Create repository"

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/sorting-hat-bot.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Railway

1. **Sign up for Railway**:
   - Go to [railway.app](https://railway.app)
   - Click "Start a New Project"
   - Sign up with GitHub (recommended)

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Authorize Railway to access your GitHub
   - Select your `sorting-hat-bot` repository

3. **Configure Environment Variables**:
   - In Railway dashboard, go to your project
   - Click on your service
   - Go to "Variables" tab
   - Add: `DISCORD_BOT_TOKEN` = `your-bot-token-here`
   - Railway will auto-detect `PORT` (no need to set it)

4. **Deploy**:
   - Railway will automatically detect Node.js
   - It will run `npm install` and `npm start`
   - Wait for deployment to complete (2-3 minutes)

5. **Get Your Bot URL**:
   - In Railway dashboard, click on your service
   - Go to "Settings" → "Networking"
   - Railway will assign a public URL (e.g., `your-bot.up.railway.app`)
   - Copy this URL

### Step 3: Update Admin Dashboard

1. **Deploy Dashboard to Netlify** (optional but recommended):
   - Go to [netlify.com](https://netlify.com)
   - Drag & drop `admin.html` file
   - Or connect GitHub repo and set build directory

2. **Update API URL**:
   - In the admin dashboard, set API URL to your Railway URL
   - Example: `https://your-bot.up.railway.app`

## Monitoring

- **View Logs**: Railway dashboard → Your service → "Deployments" → Click on deployment → "View Logs"
- **Check Status**: Your bot will show as "Active" when running
- **Restart Bot**: Click "Redeploy" in Railway dashboard

## Cost Management

- **Free Tier**: $5/month credit
- **Monitor Usage**: Railway dashboard → "Usage" tab
- **Set Limits**: You can set spending limits in settings
- **Typical Bot Cost**: Usually $0-2/month (well within free tier)

## Troubleshooting

**Bot won't start:**
- Check environment variables are set correctly
- Check logs in Railway dashboard
- Verify `DISCORD_BOT_TOKEN` is correct

**Dashboard can't connect:**
- Verify Railway URL is correct
- Check bot is actually running (green status)
- Check CORS is enabled (already done in code)

**Bot goes offline:**
- Railway free tier may pause after inactivity
- Upgrade to paid plan for 24/7 uptime
- Or use UptimeRobot to ping your bot URL every 5 minutes

## Pro Tips

1. **Keep Bot Alive**: Add UptimeRobot (free) to ping your Railway URL every 5 minutes
2. **Monitor Costs**: Check Railway usage dashboard regularly
3. **Backup Data**: The `sorted_users.json` file is in `.gitignore` - consider backing it up
4. **Update Bot**: Just push to GitHub, Railway auto-deploys!

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Deploy to Railway
3. ✅ Set environment variables
4. ✅ Test bot in Discord
5. ✅ Deploy admin dashboard to Netlify (optional)

Your bot will now run 24/7! 🎉

