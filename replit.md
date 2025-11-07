# Discord Sorting Hat Bot

## Overview
A Discord bot that sorts users into Hogwarts houses (Gryffindor, Hufflepuff, Ravenclaw, Slytherin) through an interactive questionnaire, mimicking the magical Sorting Hat ceremony from Harry Potter.

## Features
- **Interactive Sorting**: Users trigger the bot with `!sort` or `!sortinghat` command
- **Private Questions**: 4 personality-based questions sent as ephemeral messages (visible only to the user being sorted)
- **House Logic**: Answers are analyzed to determine the best house match based on traits:
  - Gryffindor: Courage, Bravery, Determination
  - Hufflepuff: Loyalty, Patience, Hard Work
  - Ravenclaw: Intelligence, Wisdom, Creativity
  - Slytherin: Ambition, Cunning, Leadership
- **Public Announcement**: Sorted house is revealed publicly with themed embeds and house colors
- **Role Assignment**: Automatically assigns house roles to users (requires proper bot permissions)
- **One-Time Sorting**: Users can only be sorted once (prevents re-sorting)

## Technical Stack
- **Runtime**: Node.js 20
- **Library**: Discord.js v14
- **Storage**: In-memory (Map objects)

## Project Structure
```
├── bot.js           # Main bot logic with sorting functionality
├── package.json     # Dependencies
└── .gitignore       # Git ignore file
```

## Setup Requirements
1. **Discord Bot Token**: Stored in Replit Secrets as `DISCORD_BOT_TOKEN`
2. **CRITICAL: Enable Message Content Intent** in Discord Developer Portal:
   - Go to Bot tab → Privileged Gateway Intents
   - Toggle ON "Message Content Intent"
   - Save changes (bot will fail without this!)
3. **Bot Permissions**: 
   - Send Messages
   - Embed Links
   - Manage Roles (for role assignment)
   - Read Message History
4. **Bot Role Position**: Must be higher than house roles in server role hierarchy

**See SETUP.md for detailed step-by-step instructions!**

## How It Works
1. User types `!sort` in a Discord channel
2. Bot sends a welcome message with a "Begin Sorting" button
3. User clicks button and receives 4 private questions
4. Each question has 4 options aligned with different house traits
5. Bot tallies answers and determines the house with most matches
6. Private reveal shows user their house
7. Public announcement celebrates the new house member
8. Bot automatically assigns the house role

## Recent Changes
- Initial project setup (Nov 7, 2025)
- Implemented full sorting questionnaire with 4 questions
- Added house role auto-assignment
- Created themed embeds with house colors and emojis
