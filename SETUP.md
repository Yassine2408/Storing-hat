# Discord Sorting Hat Bot - Setup Guide

## Prerequisites
You need to create and configure a Discord bot in the Discord Developer Portal.

## Step-by-Step Setup

### 1. Create Your Discord Application
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **"New Application"**
3. Give it a name (e.g., "Sorting Hat Bot")
4. Click **"Create"**

### 2. Configure Bot Settings
1. Click on the **"Bot"** tab in the left sidebar
2. Click **"Reset Token"** and copy the token
3. Paste this token into Replit Secrets as `DISCORD_BOT_TOKEN`

### 3. Enable Required Intents (IMPORTANT!)
Still in the **"Bot"** tab, scroll down to **"Privileged Gateway Intents"**:

**Enable these three intents:**
- ✅ **Presence Intent** (optional)
- ✅ **Server Members Intent** (optional)
- ✅ **Message Content Intent** (REQUIRED)

**Click "Save Changes"**

> **Note**: Without Message Content Intent enabled, the bot cannot read messages and the `!sort` command won't work!

### 4. Set Bot Permissions
1. Go to the **"OAuth2"** → **"URL Generator"** tab
2. Under **SCOPES**, check:
   - ✅ `bot`
   - ✅ `applications.commands`
3. Under **BOT PERMISSIONS**, check:
   - ✅ Send Messages
   - ✅ Embed Links
   - ✅ Manage Roles
   - ✅ Read Message History
   - ✅ Use Slash Commands

### 5. Invite Bot to Your Server
1. Copy the generated URL at the bottom
2. Paste it in your browser
3. Select your Discord server
4. Click **"Authorize"**

### 6. Configure Server Role Hierarchy (for role assignment)
In your Discord server:
1. Go to **Server Settings** → **Roles**
2. Make sure your bot's role is **above** the house roles (Gryffindor, Hufflepuff, Ravenclaw, Slytherin)
3. The bot will automatically create house roles when users are sorted

### 7. Start the Bot
The bot is already configured to run on Replit. Just make sure it's running!

## How to Use

### For Users:
1. Type `!sort` or `!sortinghat` in any channel the bot can see
2. Click the **"Begin Sorting"** button
3. Answer the 4 questions (only you can see them)
4. Your house will be announced publicly!

### Commands:
- `!sort` - Start the sorting ceremony
- `!sortinghat` - Alternative command to start sorting

## Troubleshooting

### "Used disallowed intents" error
- Go back to Discord Developer Portal → Bot tab
- Make sure **Message Content Intent** is enabled
- Restart the bot on Replit

### Bot doesn't respond to commands
- Check that Message Content Intent is enabled
- Make sure the bot has permission to read messages in the channel
- Verify the bot is online (green status)

### Roles not being assigned
- Check that the bot's role is higher than house roles in Server Settings → Roles
- Ensure the bot has "Manage Roles" permission

## Support
If you encounter issues, verify:
1. ✅ Bot token is correct in Replit Secrets
2. ✅ Message Content Intent is enabled in Developer Portal
3. ✅ Bot has necessary permissions in your server
4. ✅ Bot role is positioned correctly in role hierarchy
