# 🚀 Pella.app Deployment Guide

## Step-by-Step Deployment to Pella.app

### Step 1: Push to GitHub (if not done)

```bash
# If you haven't pushed to GitHub yet:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Pella.app

1. **Go to [Pella.app](https://pella.app)** and sign up/login
2. **Create a New Project/Application**
3. **Connect GitHub Repository:**
   - Select "Import from GitHub" or "Deploy from GitHub"
   - Authorize Pella to access your GitHub
   - Select your `sorting-hat-bot` repository
   - Select the branch (usually `main`)

4. **Configure Build Settings:**
   - **Build Command:** `npm install` (or leave empty if auto-detected)
   - **Start Command:** `npm start` or `node bot.js`
   - **Node Version:** Select Node.js 18 or 20 (recommended)
   - **Framework Preset:** Node.js

5. **Add Environment Variables:**
   - Go to your project settings → Environment Variables or Secrets
   - Add: `DISCORD_BOT_TOKEN` = `your-bot-token-here`
   - Add: `PORT` = `3000` (or let Pella auto-assign - they usually provide PORT automatically)

6. **Deploy:**
   - Click "Deploy" or "Start Deployment"
   - Wait for deployment to complete (usually 2-5 minutes)
   - Check the logs to ensure it started successfully

### Step 3: Get Your Bot URL

- Pella dashboard → Your project → Settings/Networking/Domains
- Copy the public URL (e.g., `your-bot.pella.app` or similar)
- Update admin dashboard API URL to this URL

### Step 4: Configure Admin Dashboard

1. **Access Dashboard:**
   - Your bot URL: `https://your-bot.pella.app`
   - Admin Dashboard: `https://your-bot.pella.app/admin.html`
   - Open in browser and set API URL to your Pella URL

2. **Or Deploy Dashboard Separately (Optional):**
   - Deploy `admin.html` to Netlify, Vercel, or any static hosting
   - Update API URL in dashboard to point to your Pella bot URL

## Monitoring

- **View Logs:** Pella dashboard → Your project → Logs/Console
- **Check Status:** Active/Running = green status
- **Restart Bot:** Click "Restart" or "Redeploy" button
- **View Metrics:** Check CPU, Memory usage in dashboard

## Troubleshooting

**Bot won't start:**
- Check environment variables are set correctly
- Check logs in Pella dashboard for errors
- Verify `DISCORD_BOT_TOKEN` is correct
- Ensure Node.js version is compatible (18+)
- Check if PORT is being assigned automatically

**Dashboard can't connect:**
- Verify Pella URL is correct
- Check bot is actually running (green status)
- Check CORS is enabled (already done in code)
- Try accessing `https://your-bot.pella.app/admin.html` directly
- Check if Pella requires specific CORS settings

**Bot goes offline:**
- Check Pella service status
- Review logs for errors
- Verify environment variables are still set
- Check if there are any resource limits

**Port issues:**
- Pella usually provides PORT automatically via environment variable
- The bot code already uses `process.env.PORT || 3000`
- If issues, check Pella's documentation for port configuration

## Pro Tips

1. **Keep Bot Alive:** Check Pella's policy on inactive services
2. **Monitor Logs:** Regularly check logs for errors or warnings
3. **Backup Data:** The `sorted_users.json` file is in `.gitignore` - consider backing it up
4. **Update Bot:** Push to GitHub, Pella will auto-deploy (if auto-deploy is enabled)
5. **Resource Limits:** Monitor CPU/Memory usage in Pella dashboard

## Environment Variables Checklist

Make sure these are set in Pella:
- ✅ `DISCORD_BOT_TOKEN` - Your Discord bot token (REQUIRED)
- ✅ `PORT` - Usually auto-provided by Pella (optional, defaults to 3000)

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Deploy to Pella.app
3. ✅ Set environment variables
4. ✅ Test bot in Discord
5. ✅ Access admin dashboard at `https://your-bot.pella.app/admin.html`

Your bot will now run 24/7 on Pella.app! 🎉

## Testing After Deployment

1. **Check Bot Status:**
   - Visit: `https://your-bot.pella.app/status`
   - Should return JSON with bot status

2. **Test Admin Dashboard:**
   - Visit: `https://your-bot.pella.app/admin.html`
   - Set API URL to your Pella URL
   - Check if bot status shows as "Online"

3. **Test in Discord:**
   - Go to your Discord server
   - Type `!sort` in the sorting channel
   - Bot should respond

