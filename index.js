require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, GatewayIntentBits, Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { queryData,queryKeys } = require("./db/dbCommands");

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Add all commands to client
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// Handle Slash Events
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Handle Select Menu Changes
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isSelectMenu()) return;
	if (interaction.customId !== 'select') return;
	
	res = await queryData("id" + interaction.guildId, interaction.values[0])
	const row = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
				.setCustomId('primary')
				.setLabel('Send Media')
				.setStyle(ButtonStyle.Primary),
		);
	if (interaction.message.components.length == 1) {
		await interaction.update({ content: `**${interaction.values[0]}:** \n ${res}`, components: [interaction.message.components[0], row] });
	}
	else {
		await interaction.update({ content: `**${interaction.values[0]}:** \n ${res}` })
	}
});

// Handle Button Press
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isButton()) return;
	
	selected = interaction.message.content.split('\n')[0].trim().slice(0, -3) + "**";
	media = interaction.message.content.split('\n')[1].trim()
	if (!media) return;
	
	username = "<@" + interaction.user.id + ">"
	await interaction.update({ content: "Media sent", components: [], ephemeral: true })
	setTimeout(async () => { await interaction.followUp({ content: `${selected} sent by ${username} \n${media}`, ephemeral: false, allowedMentions: {repliedUser: false} }) }, 0)
});

// Handle AutoComplete on commands
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isAutocomplete()) return;
	
	lstCommands = ['getmedia','removemedia','renamemedia','editmedia']
	if (!lstCommands.includes(interaction.commandName)) return;
	
	const focusedOption = interaction.options.getFocused(true);
	let choices = [];
	if (focusedOption.name === 'name') {
		res = await queryKeys("id" + interaction.guildId)
		if (res){
			res.forEach(ele => {choices.push(ele['name'])});
		}
	}
	const filtered = choices.sort((a, b) => (a.toUpperCase()[0] > b.toUpperCase()[0]) ? 1 : -1)
	await interaction.respond(
		filtered.map(choice => ({ name: choice, value: choice })),
	);
});

client.login(process.env.token);
