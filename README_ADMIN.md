# 🎩 Admin Dashboard Setup

## Quick Start

1. **Start the bot:**
   ```bash
   npm run run
   ```

2. **Open the admin dashboard:**
   - Local: `http://localhost:3000/admin.html`
   - Or just open `admin.html` in your browser and set API URL to `http://localhost:3000`

## Features

- ✅ Real-time bot status
- ✅ Start/Stop/Restart controls
- ✅ Server and user statistics
- ✅ Activity log
- ✅ Beautiful, responsive design

## For Production Deployment

### Step 1: Deploy Bot to Cloud (Railway/Render)

See `DEPLOYMENT.md` for detailed instructions.

**Quick Railway Setup:**
1. Go to railway.app
2. Connect GitHub repo
3. Add `DISCORD_BOT_TOKEN` environment variable
4. Deploy!

### Step 2: Deploy Dashboard to Netlify

1. Go to netlify.com
2. Drag & drop `admin.html` file
3. Update API URL in dashboard to your bot's URL (e.g., `https://your-bot.railway.app`)
4. Done!

## API Endpoints

- `GET /status` - Get bot status and stats
- `POST /start` - Start bot (requires process manager)
- `POST /stop` - Stop bot
- `POST /restart` - Restart bot

## Security Note

⚠️ **Important:** The current API has no authentication. For production:
- Add API key authentication
- Use HTTPS only
- Restrict access to your IP or add login

