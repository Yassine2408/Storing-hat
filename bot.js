const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const userSessions = new Map();
const sortedUsers = new Map();

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

client.on('ready', () => {
  console.log(`✨ The Sorting Hat has awakened! Logged in as ${client.user.tag}`);
  console.log(`🎩 Ready to sort students in ${client.guilds.cache.size} server(s)`);
});

client.on('guildMemberAdd', async (member) => {
  if (member.user.bot) return;

  const welcomeChannel = await findWelcomeChannel(member.guild);
  
  if (!welcomeChannel) {
    console.log(`No suitable welcome channel found in ${member.guild.name}`);
    return;
  }

  const welcomeEmbed = new EmbedBuilder()
    .setColor(0x6B4423)
    .setTitle('🧙‍♂️ Welcome to Hogwarts School of Witchcraft and Wizardry!')
    .setDescription(
      `Greetings, young witch or wizard! You've just arrived at Hogwarts School of Witchcraft and Wizardry, a place where magic thrives and friendships are forged.\n\n` +
      `Before you begin your journey through the enchanted halls, step forward and meet the Sorting Hat — it shall decide whether your spirit belongs to Gryffindor, Ravenclaw, Hufflepuff, or Slytherin.\n\n` +
      `Type !sort (or click the Sorting Hat below 🧙‍♂️) to discover your true House and begin your magical adventure!\n\n` +
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
    console.log(`Welcomed new member ${member.user.tag} to ${member.guild.name}`);
  } catch (error) {
    console.error('Error sending welcome message:', error);
  }
});

async function findWelcomeChannel(guild) {
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

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  
  if (message.content.toLowerCase() === '!sort' || message.content.toLowerCase() === '!sortinghat') {
    if (sortedUsers.has(message.author.id)) {
      const house = sortedUsers.get(message.author.id);
      const houseData = houses[house];
      return message.reply(`You have already been sorted into **${houseData.emoji} ${houseData.name}**! The Sorting Hat's decision is final... for now.`);
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
    userSessions.set(userId, { currentQuestion: 0, answers: [] });
    await askQuestion(interaction, userId);
  } else if (interaction.customId.startsWith('answer_')) {
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

  try {
    const member = await interaction.guild.members.fetch(userId);
    const roleName = houseData.name;
    let role = interaction.guild.roles.cache.find(r => r.name === roleName);

    if (!role) {
      role = await interaction.guild.roles.create({
        name: roleName,
        color: houseData.color,
        reason: 'Sorting Hat house role',
      });
      console.log(`Created role: ${roleName}`);
    }

    if (member.roles.cache.has(role.id)) {
      console.log(`User already has ${roleName} role`);
    } else {
      await member.roles.add(role);
      console.log(`Added ${roleName} role to ${interaction.user.tag}`);
    }
  } catch (error) {
    console.error('Error assigning role:', error);
    if (error.code === 50013) {
      console.log('Bot lacks permission to manage roles. Make sure the bot role is higher than house roles.');
    }
  }
}

client.login(process.env.DISCORD_BOT_TOKEN);
