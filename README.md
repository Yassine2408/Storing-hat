# 🎩 Discord Sorting Hat Bot

A magical Discord bot that sorts users into Hogwarts houses through an interactive questionnaire, just like the Sorting Hat ceremony in Harry Potter!

## ✨ Features

- **Automatic Welcome Messages**: New members are greeted with a magical welcome message
- **Interactive Sorting Ceremony**: Users command the Sorting Hat with `!sort` or click the button
- **Private Questions**: 4 personality-based questions visible only to the user
- **Smart House Selection**: Analyzes answers to match users with their perfect house
- **Public Announcement**: Celebrates new house members with themed embeds
- **Automatic Role Assignment**: Assigns house roles automatically
- **One-Time Sorting**: The Hat's decision is final (prevents re-sorting)

## 🏰 The Four Houses

- 🦁 **Gryffindor** - Courage, Bravery, Determination
- 🦡 **Hufflepuff** - Loyalty, Patience, Hard Work
- 🦅 **Ravenclaw** - Intelligence, Wisdom, Creativity
- 🐍 **Slytherin** - Ambition, Cunning, Leadership

## 🚀 Quick Start

### Prerequisites
- A Discord account
- A Discord server where you have admin permissions

### Setup Instructions

**See [SETUP.md](SETUP.md) for detailed setup instructions!**

The key steps are:
1. Create a bot in Discord Developer Portal
2. **Enable Message Content Intent & Server Members Intent** (both required!)
3. Get your bot token and add it to Replit Secrets
4. Invite the bot to your server
5. Run the bot on Replit

## 🎮 How to Use

1. In any channel, type: `!sort` or `!sortinghat`
2. Click the "Begin Sorting" button
3. Answer 4 questions honestly (only you can see them)
4. Watch as the Sorting Hat reveals your house to everyone!
5. Receive your house role automatically

## 🛠️ Technical Details

**Built with:**
- Node.js 20
- Discord.js v14
- Button interactions for smooth UX
- Ephemeral messages for privacy

**Commands:**
- `!sort` - Begin the sorting ceremony
- `!sortinghat` - Alternative command

## 📝 Bot Permissions Required

- Send Messages
- Embed Links
- Manage Roles
- Read Message History

## 🎨 Example Experience

```
User: !sort

Bot: 🎩 The Sorting Hat Ceremony
     [Begin Sorting] button

User: *clicks button*

Bot (private): Question 1 of 4
               You discover a hidden path in the Forbidden Forest...
               [4 choice buttons]

... 3 more questions ...

Bot (private): You belong in...
               🦁 GRYFFINDOR!

Bot (public): 🎩 A NEW STUDENT HAS BEEN SORTED!
              @User has been sorted into 🦁 GRYFFINDOR! 🦁
```

## 🔧 Troubleshooting

**Bot doesn't respond to `!sort`:**
- Make sure Message Content Intent is enabled in Discord Developer Portal
- Verify the bot has permission to read messages
- Check that the bot is online

**Roles not being assigned:**
- Ensure bot role is higher than house roles in server settings
- Verify bot has "Manage Roles" permission

See [SETUP.md](SETUP.md) for more troubleshooting tips!

## 📄 License

This project is open source and available for personal use.

---

*"Oh, you may not think I'm pretty, but don't judge on what you see..."* 🎩
