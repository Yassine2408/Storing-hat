# 🚀 Daki Hosting Deployment Guide

## Step-by-Step Deployment to Daki Hosting

### Step 1: Push to GitHub (if not done)

```bash
# If you haven't pushed to GitHub yet:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Daki Hosting

1. **Go to [Daki Hosting](https://daki.host)** and sign up/login
2. **Create a New Project/Application**
3. **Connect GitHub Repository:**
   - Select "Deploy from GitHub"
   - Authorize Daki to access your GitHub
   - Select your `sorting-hat-bot` repository
   - Select the branch (usually `main`)

4. **Configure Build Settings:**
   - **Build Command:** `npm install`
   - **Start Command:** `npm start` or `node bot.js`
   - **Node Version:** Select Node.js 18 or 20 (recommended)

5. **Add Environment Variables:**
   - Go to your project settings → Environment Variables
   - Add: `DISCORD_BOT_TOKEN` = `your-bot-token-here`
   - Add: `PORT` = `3000` (or let Daki auto-assign)

6. **Deploy:**
   - Click "Deploy" or "Start Deployment"
   - Wait for deployment to complete (usually 2-5 minutes)

### Step 3: Get Your Bot URL

- Daki dashboard → Your project → Settings/Networking
- Copy the public URL (e.g., `your-bot.daki.host` or similar)
- Update admin dashboard API URL to this URL

### Step 4: Configure Admin Dashboard

1. **Update API URL in admin.html:**
   - Open `admin.html` in a text editor
   - Find the default API URL (line ~295)
   - Or set it in the dashboard after deployment

2. **Deploy Dashboard (Optional):**
   - You can deploy `admin.html` to Netlify, Vercel, or any static hosting
   - Or access it via your Daki bot URL: `https://your-bot.daki.host/admin.html`

## Monitoring

- **View Logs:** Daki dashboard → Your project → Logs
- **Check Status:** Green/Active = running
- **Restart Bot:** Click "Restart" or "Redeploy" button

## Troubleshooting

**Bot won't start:**
- Check environment variables are set correctly
- Check logs in Daki dashboard
- Verify `DISCORD_BOT_TOKEN` is correct
- Ensure Node.js version is compatible (18+)

**Dashboard can't connect:**
- Verify Daki URL is correct
- Check bot is actually running
- Check CORS is enabled (already done in code)
- Try accessing `https://your-bot.daki.host/admin.html` directly

**Bot goes offline:**
- Check Daki service status
- Review logs for errors
- Verify environment variables are still set

## Pro Tips

1. **Keep Bot Alive:** Some hosting services pause inactive services - check Daki's policy
2. **Monitor Logs:** Regularly check logs for errors
3. **Backup Data:** The `sorted_users.json` file is in `.gitignore` - consider backing it up
4. **Update Bot:** Push to GitHub, Daki will auto-deploy (if auto-deploy is enabled)

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Deploy to Daki Hosting
3. ✅ Set environment variables
4. ✅ Test bot in Discord
5. ✅ Access admin dashboard at `https://your-bot.daki.host/admin.html`

Your bot will now run 24/7 on Daki Hosting! 🎉

