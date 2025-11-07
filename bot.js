require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const express = require('express');
const cors = require('cors');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const fs = require('fs');
const path = require('path');

const userSessions = new Map();
const sortedUsers = new Map();
const SORTED_USERS_FILE = path.join(__dirname, 'sorted_users.json');

// Logging system for dashboard
const dashboardLogs = [];
const MAX_LOGS = 100;

function addDashboardLog(message, type = 'info') {
  const logEntry = {
    timestamp: new Date().toISOString(),
    message,
    type
  };
  dashboardLogs.unshift(logEntry);
  if (dashboardLogs.length > MAX_LOGS) {
    dashboardLogs.pop();
  }
  // Also log to console
  const logMethod = type === 'error' ? console.error : type === 'success' ? console.log : console.log;
  logMethod(`[${new Date().toLocaleTimeString()}] ${message}`);
}

// Load sorted users from file on startup
function loadSortedUsers() {
  try {
    if (fs.existsSync(SORTED_USERS_FILE)) {
      const data = fs.readFileSync(SORTED_USERS_FILE, 'utf8');
      const loaded = JSON.parse(data);
      for (const [userId, house] of Object.entries(loaded)) {
        sortedUsers.set(userId, house);
      }
      addDashboardLog(`📚 Loaded ${sortedUsers.size} sorted users from file`, 'info');
    }
  } catch (error) {
    console.error('Error loading sorted users:', error);
  }
}

// Save sorted users to file
function saveSortedUsers() {
  try {
    const data = Object.fromEntries(sortedUsers);
    fs.writeFileSync(SORTED_USERS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving sorted users:', error);
  }
}

// Helper function to find house role (for scanning - defined before houses object)
function findHouseRoleForScan(guild, houseData) {
  // First priority: Find role containing the emoji (most reliable for fancy Unicode versions)
  let role = guild.roles.cache.find(r => r.name.includes(houseData.emoji));
  if (role) return role;

  // Second priority: Try exact match
  role = guild.roles.cache.find(r => r.name === houseData.name);
  if (role) return role;

  // Third priority: Try to find role containing the house name (case-insensitive)
  const houseNameLower = houseData.name.toLowerCase();
  role = guild.roles.cache.find(r => {
    const roleNameNormalized = r.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const houseNameNormalized = houseNameLower.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return roleNameNormalized.includes(houseNameNormalized);
  });
  if (role) return role;

  return null;
}

// Scan guild for users with house roles and add them to sortedUsers
async function scanGuildForSortedUsers(guild) {
  try {
    addDashboardLog(`🔍 Scanning ${guild.name} for users with house roles...`, 'info');
    let foundCount = 0;

    // Get all house roles in this guild
    const houseRoles = [];
    for (const [houseKey, houseData] of Object.entries(houses)) {
      const role = findHouseRoleForScan(guild, houseData);
      if (role) {
        houseRoles.push({ role, house: houseKey, houseData });
      }
    }

    if (houseRoles.length === 0) {
      console.log(`   No house roles found in ${guild.name}`);
      return 0;
    }

    // Fetch all members (this might take a moment for large servers)
    await guild.members.fetch();
    
    // Check each member
    for (const member of guild.members.cache.values()) {
      if (member.user.bot) continue;

      // Check if member has any house role
      for (const { role, house } of houseRoles) {
        if (member.roles.cache.has(role.id)) {
          // Add to sortedUsers if not already there
          if (!sortedUsers.has(member.user.id)) {
            sortedUsers.set(member.user.id, house);
            foundCount++;
          }
          break; // User can only have one house
        }
      }
    }

    if (foundCount > 0) {
      addDashboardLog(`   ✅ Found ${foundCount} new sorted users in ${guild.name}`, 'success');
      saveSortedUsers(); // Save after each guild scan
    } else {
      addDashboardLog(`   No new sorted users found in ${guild.name}`, 'info');
    }

    return foundCount;
  } catch (error) {
    console.error(`Error scanning ${guild.name}:`, error);
    return 0;
  }
}

// Scan all guilds on startup
async function scanAllGuildsForSortedUsers() {
  addDashboardLog('🔍 Starting scan of all guilds for users with house roles...', 'info');
  let totalFound = 0;

  for (const guild of client.guilds.cache.values()) {
    const found = await scanGuildForSortedUsers(guild);
    totalFound += found;
    
    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  addDashboardLog(`✅ Scan complete! Found ${totalFound} total sorted users across all servers.`, 'success');
  addDashboardLog(`📊 Total sorted users in database: ${sortedUsers.size}`, 'info');
}

const houses = {
  GRYFFINDOR: {
    name: 'Gryffindor',
    emoji: '🦁',
    color: 0x740001,
    traits: 'Courage, Bravery, Determination',
    description: 'Where dwell the brave at heart. Their daring, nerve, and chivalry set Gryffindors apart.'
  },
  HUFFLEPUFF: {
    name: 'Hufflepuff',
    emoji: '🦡',
    color: 0xFFD800,
    traits: 'Loyalty, Patience, Hard Work',
    description: 'Where they are just and loyal. Patient Hufflepuffs are true and unafraid of toil.'
  },
  RAVENCLAW: {
    name: 'Ravenclaw',
    emoji: '🦅',
    color: 0x0E1A40,
    traits: 'Intelligence, Wisdom, Creativity',
    description: 'Where those of wit and learning will always find their kind. If you have a ready mind.'
  },
  SLYTHERIN: {
    name: 'Slytherin',
    emoji: '🐍',
    color: 0x1A472A,
    traits: 'Ambition, Cunning, Leadership',
    description: 'Those cunning folk use any means to achieve their ends. Resourceful and ambitious.'
  }
};

const questions = [
  {
    question: "You discover a hidden path in the Forbidden Forest. What do you do?",
    options: [
      { label: "Explore it immediately - adventure awaits!", house: 'GRYFFINDOR', emoji: '⚔️' },
      { label: "Mark it on a map and research it first", house: 'RAVENCLAW', emoji: '📚' },
      { label: "Tell your friends so you can explore together", house: 'HUFFLEPUFF', emoji: '🤝' },
      { label: "Keep it secret for strategic advantage", house: 'SLYTHERIN', emoji: '🎯' }
    ]
  },
  {
    question: "A fellow student is struggling with their homework. What's your approach?",
    options: [
      { label: "Offer to help them study together", house: 'HUFFLEPUFF', emoji: '💛' },
      { label: "Explain the concept in detail", house: 'RAVENCLAW', emoji: '🧠' },
      { label: "Help if they ask, but focus on your own work", house: 'SLYTHERIN', emoji: '📈' },
      { label: "Stand up for them if others mock their struggle", house: 'GRYFFINDOR', emoji: '🛡️' }
    ]
  },
  {
    question: "You find a mysterious spellbook. What interests you most?",
    options: [
      { label: "Spells that could protect others", house: 'GRYFFINDOR', emoji: '✨' },
      { label: "Understanding how the magic works", house: 'RAVENCLAW', emoji: '🔮' },
      { label: "Spells that bring people together", house: 'HUFFLEPUFF', emoji: '🌟' },
      { label: "Powerful spells that give you an edge", house: 'SLYTHERIN', emoji: '⚡' }
    ]
  },
  {
    question: "What quality do you value most in yourself?",
    options: [
      { label: "My courage to face challenges", house: 'GRYFFINDOR', emoji: '🔥' },
      { label: "My dedication and reliability", house: 'HUFFLEPUFF', emoji: '🌻' },
      { label: "My curiosity and knowledge", house: 'RAVENCLAW', emoji: '📖' },
      { label: "My ambition and resourcefulness", house: 'SLYTHERIN', emoji: '👑' }
    ]
  }
];

client.on('ready', async () => {
  addDashboardLog(`✨ The Sorting Hat has awakened! Logged in as ${client.user.tag}`, 'success');
  addDashboardLog(`🎩 Ready to sort students in ${client.guilds.cache.size} server(s)`, 'info');
  
  // Load previously sorted users from file
  loadSortedUsers();
  
  // Scan all guilds for users who already have house roles
  await scanAllGuildsForSortedUsers();
});

client.on('guildMemberAdd', async (member) => {
  if (member.user.bot) return;

  // Auto-assign Muggles role to new members
  try {
    let mugglesRole = member.guild.roles.cache.find(r => r.name === 'Muggles');
    
    // Double-check prevents duplicate roles during concurrent joins
    if (!mugglesRole) {
      await member.guild.roles.fetch();
      mugglesRole = member.guild.roles.cache.find(r => r.name === 'Muggles');
      
      if (!mugglesRole) {
        mugglesRole = await member.guild.roles.create({
          name: 'Muggles',
          color: 0x808080,
          reason: 'Auto-assigned role for unsorted members'
        });
        addDashboardLog(`Created Muggles role in ${member.guild.name}`, 'info');
      }
    }

    if (!member.roles.cache.has(mugglesRole.id)) {
      await member.roles.add(mugglesRole);
      addDashboardLog(`Assigned Muggles role to ${member.user.tag} in ${member.guild.name}`, 'info');
    }
  } catch (error) {
    console.error('Error assigning Muggles role:', error);
    if (error.code === 50013) {
      console.log('Bot lacks permission to manage roles. Ensure bot role is positioned higher than Muggles role.');
    }
  }

  const welcomeChannel = await findWelcomeChannel(member.guild);
  
  if (!welcomeChannel) {
    console.log(`No suitable welcome channel found in ${member.guild.name}`);
    return;
  }

  const sortingChannel = await findSortingChannel(member.guild);
  
  let sortingMessage;
  if (sortingChannel && welcomeChannel.id === sortingChannel.id) {
    sortingMessage = `🎩 You're in the sorting chamber! Type !sort or click below to begin your ceremony!`;
  } else {
    sortingMessage = `Type !sort (or click the Sorting Hat below 🧙‍♂️) to discover your true House and begin your magical adventure!`;
    if (sortingChannel) {
      sortingMessage += `\n\n🎩 Visit <#${sortingChannel.id}> to begin your sorting ceremony!`;
    }
  }

  const welcomeEmbed = new EmbedBuilder()
    .setColor(0x6B4423)
    .setTitle('🧙‍♂️ Welcome to Hogwarts School of Witchcraft and Wizardry!')
    .setDescription(
      `Greetings, young witch or wizard! You've just arrived at Hogwarts School of Witchcraft and Wizardry, a place where magic thrives and friendships are forged.\n\n` +
      `Before you begin your journey through the enchanted halls, step forward and meet the Sorting Hat — it shall decide whether your spirit belongs to Gryffindor, Ravenclaw, Hufflepuff, or Slytherin.\n\n` +
      `${sortingMessage}\n\n` +
      `✨ Wands at the ready, and may your House bring you honor!`
    )
    .setThumbnail(member.user.displayAvatarURL())
    .setFooter({ text: 'The Sorting Hat awaits...' })
    .setTimestamp();

  const startButton = new ButtonBuilder()
    .setCustomId('start_sorting')
    .setLabel('Begin Sorting')
    .setStyle(ButtonStyle.Primary)
    .setEmoji('🎩');

  const row = new ActionRowBuilder().addComponents(startButton);

  try {
    await welcomeChannel.send({ 
      content: `${member}`, 
      embeds: [welcomeEmbed], 
      components: [row] 
    });
    addDashboardLog(`Welcomed new member ${member.user.tag} to ${member.guild.name}`, 'info');
  } catch (error) {
    console.error('Error sending welcome message:', error);
  }
});

async function findWelcomeChannel(guild) {
  const sortingChannel = guild.channels.cache.find(
    channel => channel.name.toLowerCase() === '🎩┃choose-your-house'.toLowerCase() && 
    channel.isTextBased() &&
    channel.permissionsFor(guild.members.me).has([
      PermissionFlagsBits.SendMessages,
      PermissionFlagsBits.EmbedLinks,
      PermissionFlagsBits.ViewChannel
    ])
  );

  if (sortingChannel) {
    return sortingChannel;
  }

  if (guild.systemChannel && 
      guild.systemChannel.permissionsFor(guild.members.me).has([
        PermissionFlagsBits.SendMessages, 
        PermissionFlagsBits.EmbedLinks
      ])) {
    return guild.systemChannel;
  }

  const textChannels = guild.channels.cache.filter(
    channel => channel.isTextBased() && 
    channel.permissionsFor(guild.members.me).has([
      PermissionFlagsBits.SendMessages,
      PermissionFlagsBits.EmbedLinks,
      PermissionFlagsBits.ViewChannel
    ])
  );

  return textChannels.first() || null;
}

async function findSortingChannel(guild) {
  const sortingChannel = guild.channels.cache.find(
    channel => channel.name.toLowerCase() === '🎩┃choose-your-house'.toLowerCase() && 
    channel.isTextBased() &&
    channel.permissionsFor(guild.members.me).has([
      PermissionFlagsBits.SendMessages,
      PermissionFlagsBits.EmbedLinks,
      PermissionFlagsBits.ViewChannel
    ])
  );

  return sortingChannel || null;
}

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  
  if (message.content.toLowerCase() === '!sort' || message.content.toLowerCase() === '!sortinghat') {
    if (sortedUsers.has(message.author.id)) {
      const house = sortedUsers.get(message.author.id);
      const houseData = houses[house];
      return message.reply(`You have already been sorted into **${houseData.emoji} ${houseData.name}**! The Sorting Hat's decision is final... for now.`);
    }

    const sortingChannel = await findSortingChannel(message.guild);
    
    if (!sortingChannel) {
      return message.reply('⚠️ The Sorting Hat cannot find the designated sorting chamber! Please contact a server administrator.');
    }

    if (message.channel.id !== sortingChannel.id) {
      return message.reply(`🎩 The Sorting Hat only speaks in <#${sortingChannel.id}>! Please go there to begin your ceremony.`);
    }

    const welcomeEmbed = new EmbedBuilder()
      .setColor(0x6B4423)
      .setTitle('🎩 The Sorting Hat Ceremony')
      .setDescription('*The ancient hat stirs to life...*\n\n"Ah, another student to sort! Let me peer into your mind and see where you truly belong..."\n\nI will ask you **four questions**. Answer honestly, and I shall place you in the house where you will thrive!\n\n**Click the button below to begin your sorting!**')
      .setFooter({ text: 'The Sorting Hat knows best...' });

    const startButton = new ButtonBuilder()
      .setCustomId('start_sorting')
      .setLabel('Begin Sorting')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('🎩');

    const row = new ActionRowBuilder().addComponents(startButton);

    await message.reply({ embeds: [welcomeEmbed], components: [row] });
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  const userId = interaction.user.id;

  if (interaction.customId === 'start_sorting') {
    if (sortedUsers.has(userId)) {
      const house = sortedUsers.get(userId);
      const houseData = houses[house];
      return interaction.reply({ content: `You have already been sorted into **${houseData.emoji} ${houseData.name}**! The Sorting Hat's decision is final... for now.`, ephemeral: true });
    }

    const sortingChannel = await findSortingChannel(interaction.guild);
    
    if (!sortingChannel) {
      return interaction.reply({ content: '⚠️ The Sorting Hat cannot find its chamber! Please contact an administrator.', ephemeral: true });
    }

    if (interaction.channel.id !== sortingChannel.id) {
      return interaction.reply({ content: `🎩 The Sorting Ceremony must be performed in <#${sortingChannel.id}>!`, ephemeral: true });
    }

    userSessions.set(userId, { currentQuestion: 0, answers: [] });
    await askQuestion(interaction, userId);
  } else if (interaction.customId.startsWith('answer_')) {
    const sortingChannel = await findSortingChannel(interaction.guild);
    
    if (!sortingChannel) {
      return interaction.reply({ content: '⚠️ The Sorting Hat cannot find its chamber! Please contact an administrator.', ephemeral: true });
    }

    if (interaction.channel.id !== sortingChannel.id) {
      userSessions.delete(userId);
      return interaction.reply({ content: `⚠️ You must complete the sorting in <#${sortingChannel.id}>!`, ephemeral: true });
    }

    const answerIndex = parseInt(interaction.customId.split('_')[1]);
    const session = userSessions.get(userId);
    
    if (!session) {
      return interaction.reply({ content: 'Session expired. Please start over with !sort', ephemeral: true });
    }

    const currentQ = questions[session.currentQuestion];
    const selectedHouse = currentQ.options[answerIndex].house;
    session.answers.push(selectedHouse);

    session.currentQuestion++;

    if (session.currentQuestion < questions.length) {
      await askQuestion(interaction, userId);
    } else {
      await revealHouse(interaction, userId, session.answers);
      userSessions.delete(userId);
    }
  }
});

async function askQuestion(interaction, userId) {
  const session = userSessions.get(userId);
  const question = questions[session.currentQuestion];

  const embed = new EmbedBuilder()
    .setColor(0x6B4423)
    .setTitle(`🎩 Question ${session.currentQuestion + 1} of ${questions.length}`)
    .setDescription(`*The Sorting Hat whispers...*\n\n**${question.question}**`)
    .setFooter({ text: 'Choose the answer that resonates with you...' });

  const buttons = question.options.map((option, index) => 
    new ButtonBuilder()
      .setCustomId(`answer_${index}`)
      .setLabel(option.label)
      .setStyle(ButtonStyle.Secondary)
      .setEmoji(option.emoji)
  );

  const rows = [];
  for (let i = 0; i < buttons.length; i += 2) {
    const row = new ActionRowBuilder().addComponents(buttons.slice(i, i + 2));
    rows.push(row);
  }

  if (interaction.replied || interaction.deferred) {
    await interaction.editReply({ embeds: [embed], components: rows, ephemeral: true });
  } else {
    await interaction.reply({ embeds: [embed], components: rows, ephemeral: true });
  }
}

function findHouseRole(guild, houseData) {
  // First priority: Find role containing the emoji (most reliable for fancy Unicode versions)
  // This will find roles like "𝔖𝔩𝔶𝔱𝔥𝔢𝔯𝔦𝔫🐍" before plain "Slytherin"
  let role = guild.roles.cache.find(r => r.name.includes(houseData.emoji));
  if (role) return role;

  // Second priority: Try exact match (for backwards compatibility with plain roles)
  role = guild.roles.cache.find(r => r.name === houseData.name);
  if (role) return role;

  // Third priority: Try to find role containing the house name (case-insensitive, handles fancy Unicode)
  const houseNameLower = houseData.name.toLowerCase();
  role = guild.roles.cache.find(r => {
    // Normalize both strings for comparison (handles Unicode variants)
    const roleNameNormalized = r.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const houseNameNormalized = houseNameLower.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return roleNameNormalized.includes(houseNameNormalized);
  });
  if (role) return role;

  return null;
}

async function revealHouse(interaction, userId, answers) {
  const houseCounts = {};
  answers.forEach(house => {
    houseCounts[house] = (houseCounts[house] || 0) + 1;
  });

  let sortedHouse = Object.keys(houseCounts).reduce((a, b) => 
    houseCounts[a] > houseCounts[b] ? a : b
  );

  if (Object.values(houseCounts).filter(count => count === houseCounts[sortedHouse]).length > 1) {
    const tiedHouses = Object.keys(houseCounts).filter(h => houseCounts[h] === houseCounts[sortedHouse]);
    sortedHouse = tiedHouses[Math.floor(Math.random() * tiedHouses.length)];
  }

  sortedUsers.set(userId, sortedHouse);
  saveSortedUsers(); // Persist to file
  const houseData = houses[sortedHouse];

  const thinkingEmbed = new EmbedBuilder()
    .setColor(0x6B4423)
    .setDescription('*The Sorting Hat ponders deeply...*\n\n"Hmm... interesting, very interesting..."');

  if (interaction.replied || interaction.deferred) {
    await interaction.editReply({ embeds: [thinkingEmbed], components: [], ephemeral: true });
  } else {
    await interaction.reply({ embeds: [thinkingEmbed], components: [], ephemeral: true });
  }

  await new Promise(resolve => setTimeout(resolve, 2000));

  const privateEmbed = new EmbedBuilder()
    .setColor(houseData.color)
    .setTitle(`🎩 The Hat Has Decided!`)
    .setDescription(`You belong in...\n\n# ${houseData.emoji} ${houseData.name.toUpperCase()}!`)
    .addFields(
      { name: 'House Traits', value: houseData.traits, inline: false },
      { name: 'About Your House', value: houseData.description, inline: false }
    )
    .setFooter({ text: 'Your house will be announced publicly!' });

  await interaction.editReply({ embeds: [privateEmbed], components: [], ephemeral: true });

  const channel = interaction.channel;
  const publicEmbed = new EmbedBuilder()
    .setColor(houseData.color)
    .setTitle('🎩 A NEW STUDENT HAS BEEN SORTED!')
    .setDescription(`The Sorting Hat has spoken!\n\n${interaction.user} has been sorted into...\n\n# ${houseData.emoji} ${houseData.name.toUpperCase()}! ${houseData.emoji}`)
    .addFields(
      { name: 'House Traits', value: houseData.traits, inline: true }
    )
    .setThumbnail(interaction.user.displayAvatarURL())
    .setFooter({ text: `Welcome to ${houseData.name}!` })
    .setTimestamp();

  await channel.send({ embeds: [publicEmbed] });

  let houseRoleAssigned = false;
  try {
    const member = await interaction.guild.members.fetch(userId);
    let role = findHouseRole(interaction.guild, houseData);

    if (!role) {
      // Only create if no matching role found
      role = await interaction.guild.roles.create({
        name: houseData.name,
        color: houseData.color,
        reason: 'Sorting Hat house role',
      });
      addDashboardLog(`Created role: ${houseData.name}`, 'info');
    } else {
      addDashboardLog(`Found existing role: ${role.name}`, 'info');
    }
    if (member.roles.cache.has(role.id)) {
      addDashboardLog(`User already has ${role.name} role`, 'info');
      houseRoleAssigned = true;
    } else {
      await member.roles.add(role);
      addDashboardLog(`Added ${role.name} role to ${interaction.user.tag}`, 'success');
      houseRoleAssigned = true;
    }

    // Remove Muggles role after successful house role assignment
    // Iterate over all member roles to remove any "Muggles" role (handles duplicates)
    const mugglesRoles = member.roles.cache.filter(r => r.name === 'Muggles');
    
    if (mugglesRoles.size === 0) {
      addDashboardLog(`User ${interaction.user.tag} did not have Muggles role`, 'info');
    } else {
      for (const mugglesRole of mugglesRoles.values()) {
        await member.roles.remove(mugglesRole);
        addDashboardLog(`Removed Muggles role from ${interaction.user.tag}`, 'info');
      }
    }
  } catch (error) {
    // Distinguish between house assignment and Muggles removal failures
    // If house role was assigned successfully, error is likely from Muggles removal
    if (houseRoleAssigned) {
      console.error('[Muggles Removal] Error removing Muggles role:', error);
    } else {
      console.error('Error assigning role:', error);
    }
    if (error.code === 50013) {
      console.log('Bot lacks permission to manage roles. Make sure the bot role is higher than house roles.');
    }
  }
}

client.login(process.env.DISCORD_BOT_TOKEN);

// Admin API Server
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files (admin.html)

const PORT = process.env.PORT || 3000;
let botRestarting = false;

// Status endpoint
app.get('/status', (req, res) => {
  res.json({
    online: client.isReady(),
    botTag: client.user ? client.user.tag : null,
    serverCount: client.guilds.cache.size,
    sortedUsers: sortedUsers.size,
    activeSessions: userSessions.size,
    uptime: client.uptime
  });
});

// Get dashboard logs
app.get('/logs', (req, res) => {
  res.json({
    success: true,
    logs: dashboardLogs
  });
});

// Get list of sorted users
app.get('/sorted-users', async (req, res) => {
  try {
    const sortedUsersList = [];
    
    for (const [userId, house] of sortedUsers.entries()) {
      try {
        // Try to get user info from Discord
        let userTag = userId;
        let userName = 'Unknown User';
        
        // Try to find user in any guild
        for (const guild of client.guilds.cache.values()) {
          try {
            const member = await guild.members.fetch(userId).catch(() => null);
            if (member) {
              userTag = member.user.tag;
              userName = member.user.username;
              break;
            }
          } catch (e) {
            // Continue to next guild
          }
        }
        
        sortedUsersList.push({
          userId,
          userTag,
          userName,
          house,
          houseName: houses[house]?.name || house,
          houseEmoji: houses[house]?.emoji || ''
        });
      } catch (error) {
        // If we can't fetch user, still include them with basic info
        sortedUsersList.push({
          userId,
          userTag: userId,
          userName: 'Unknown User',
          house,
          houseName: houses[house]?.name || house,
          houseEmoji: houses[house]?.emoji || ''
        });
      }
    }
    
    // Sort by house, then by username
    sortedUsersList.sort((a, b) => {
      if (a.house !== b.house) {
        return a.house.localeCompare(b.house);
      }
      return a.userName.localeCompare(b.userName);
    });
    
    res.json({
      success: true,
      total: sortedUsersList.length,
      users: sortedUsersList
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start bot endpoint (for future use - currently just returns status)
app.post('/start', (req, res) => {
  if (client.isReady()) {
    return res.json({ success: true, message: 'Bot is already running' });
  }
  res.json({ success: false, error: 'Bot start must be done via process manager' });
});

// Stop bot endpoint
app.post('/stop', (req, res) => {
  if (!client.isReady()) {
    return res.json({ success: false, error: 'Bot is not running' });
  }
  
  client.destroy();
  res.json({ success: true, message: 'Bot stopped' });
  
  // Exit process after a short delay
  setTimeout(() => {
    process.exit(0);
  }, 1000);
});

// Restart bot endpoint
app.post('/restart', (req, res) => {
  if (botRestarting) {
    return res.json({ success: false, error: 'Bot is already restarting' });
  }
  
  botRestarting = true;
  res.json({ success: true, message: 'Bot restarting...' });
  
  client.destroy().then(() => {
    setTimeout(() => {
      process.exit(1); // Exit with code 1 to trigger restart in process manager
    }, 1000);
  });
});

// Get guilds list
app.get('/guilds', (req, res) => {
  const guildsList = client.guilds.cache.map(guild => ({
    id: guild.id,
    name: guild.name,
    memberCount: guild.memberCount
  }));
  res.json({
    success: true,
    guilds: guildsList
  });
});

// Add house role to user
app.post('/users/:userId/assign-house', async (req, res) => {
  try {
    const { userId } = req.params;
    const { house, guildId } = req.body;

    if (!house || !guildId) {
      return res.status(400).json({ success: false, error: 'House and guildId are required' });
    }

    if (!houses[house]) {
      return res.status(400).json({ success: false, error: 'Invalid house' });
    }

    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
      return res.status(404).json({ success: false, error: 'Guild not found' });
    }

    const member = await guild.members.fetch(userId).catch(() => null);
    if (!member) {
      return res.status(404).json({ success: false, error: 'User not found in guild' });
    }

    const houseData = houses[house];
    let role = findHouseRole(guild, houseData);

    if (!role) {
      // Create role if it doesn't exist
      role = await guild.roles.create({
        name: houseData.name,
        color: houseData.color,
        reason: 'Admin assigned house role'
      });
      addDashboardLog(`Created ${houseData.name} role in ${guild.name}`, 'info');
    }

    // Remove all other house roles first
    for (const [houseKey, otherHouseData] of Object.entries(houses)) {
      if (houseKey !== house) {
        const otherRole = findHouseRole(guild, otherHouseData);
        if (otherRole && member.roles.cache.has(otherRole.id)) {
          await member.roles.remove(otherRole);
          addDashboardLog(`Removed ${otherHouseData.name} role from ${member.user.tag}`, 'info');
        }
      }
    }

    // Add the new house role
    if (!member.roles.cache.has(role.id)) {
      await member.roles.add(role);
      addDashboardLog(`Assigned ${houseData.name} role to ${member.user.tag}`, 'success');
    }

    // Update sortedUsers
    sortedUsers.set(userId, house);
    saveSortedUsers();

    // Remove Muggles role if present
    const mugglesRoles = member.roles.cache.filter(r => r.name === 'Muggles');
    for (const mugglesRole of mugglesRoles.values()) {
      await member.roles.remove(mugglesRole);
    }

    res.json({
      success: true,
      message: `Assigned ${houseData.name} role to ${member.user.tag}`
    });
  } catch (error) {
    addDashboardLog(`Error assigning house role: ${error.message}`, 'error');
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Remove house role from user
app.post('/users/:userId/remove-house', async (req, res) => {
  try {
    const { userId } = req.params;
    const { guildId } = req.body;

    if (!guildId) {
      return res.status(400).json({ success: false, error: 'guildId is required' });
    }

    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
      return res.status(404).json({ success: false, error: 'Guild not found' });
    }

    const member = await guild.members.fetch(userId).catch(() => null);
    if (!member) {
      return res.status(404).json({ success: false, error: 'User not found in guild' });
    }

    // Remove all house roles
    let removedCount = 0;
    for (const [houseKey, houseData] of Object.entries(houses)) {
      const role = findHouseRole(guild, houseData);
      if (role && member.roles.cache.has(role.id)) {
        await member.roles.remove(role);
        removedCount++;
        addDashboardLog(`Removed ${houseData.name} role from ${member.user.tag}`, 'info');
      }
    }

    // Remove from sortedUsers
    if (sortedUsers.has(userId)) {
      sortedUsers.delete(userId);
      saveSortedUsers();
    }

    // Re-add Muggles role
    let mugglesRole = guild.roles.cache.find(r => r.name === 'Muggles');
    if (!mugglesRole) {
      mugglesRole = await guild.roles.create({
        name: 'Muggles',
        color: 0x808080,
        reason: 'User removed from house'
      });
    }
    if (!member.roles.cache.has(mugglesRole.id)) {
      await member.roles.add(mugglesRole);
    }

    res.json({
      success: true,
      message: `Removed house role(s) from ${member.user.tag}`,
      removedCount
    });
  } catch (error) {
    addDashboardLog(`Error removing house role: ${error.message}`, 'error');
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start API server
app.listen(PORT, () => {
  addDashboardLog(`🌐 Admin API server running on port ${PORT}`, 'success');
  addDashboardLog(`📊 Dashboard: http://localhost:${PORT}/admin.html`, 'info');
});
