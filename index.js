require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, GatewayIntentBits, Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { queryData, queryKeys, queryKeysFilter, dbStatus} = require("./db/dbCommands");
const { isSimilar } = require('./util/searchQuery');
const express = require('express');
const { isAttachable } = require('./util/isAttachable');
const app = express();
const port = process.env.PORT || 3000;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

// When the client is ready, run this code (only once)
// Create the website after the bot is ready
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
	app.listen(port, '0.0.0.0', () => {
		console.log(`Server Started at Port ${port}`)
	});
	
	app.get('/', (request, response) => {
		return response.sendFile('index.html', { root: '.' });
	});
	app.get('/health', async (request, response) => {
		let status = await dbStatus();
		response.status(200);
		return response.send({ dbstatus: status, status:"active"});
	});
	
	app.listen(() => console.log(`App listening at http://localhost:${port}`));
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
	if (!interaction.isStringSelectMenu()) return;
	if (interaction.customId !== 'select') return;

	res = await queryData(interaction.guildId, interaction.values[0])
	interactionComponents = interaction.message.components
	if (interactionComponents.length > 1) {
		// add to row with next and prev
		prevButtonRow = interaction.message.components[1].components
		if (prevButtonRow.length == 2) {
			const send = new ButtonBuilder()
				.setCustomId('send')
				.setLabel("Send")
				.setStyle(ButtonStyle.Success)
			const newRows = new ActionRowBuilder()
			prevButtonRow.forEach(element => {
				newRows.addComponents(element)
			});
			newRows.addComponents(send)
			return await interaction.update({ content: `**${interaction.values[0]}:** \n ${res}`, components: [interaction.message.components[0], newRows] })
		}
	}
	else {
		prevButtonRow = interaction.message.components[0]
		const send = new ButtonBuilder()
			.setCustomId('send')
			.setLabel("Send")
			.setStyle(ButtonStyle.Success)
		const buttonRows = new ActionRowBuilder().addComponents(send)
		return await interaction.update({ content: `**${interaction.values[0]}:** \n ${res}`, components: [interaction.message.components[0], buttonRows] })
	}

	await interaction.update({ content: `**${interaction.values[0]}:** \n ${res}` })

});

// Handle Send Button Press
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isButton()) return;
	if (!(interaction.customId == 'send')) return;

	selected = interaction.message.content.split('\n')[0].trim().slice(0, -3) + "**";
	media = interaction.message.content.split('\n')[1].trim()
	if (!media) return;

	username = "<@" + interaction.user.id + ">"
	await interaction.update({ content: "Media sent", components: [], ephemeral: true })

	let res = await isAttachable(media)
	if (res[0]) {
		setTimeout(async () => {
			await interaction.followUp({
				content: `${selected} sent by ${username}`, ephemeral: false, allowedMentions: { repliedUser: false }, files: [{
					attachment: media,
					name: 'media' + res[1]
				}]
			})
		}, 0)
	}
	else {
		setTimeout(async () => { await interaction.followUp({ content: `${selected} sent by ${username} \n${media}`, ephemeral: false, allowedMentions: { repliedUser: false } }) }, 0)
	}
});


// Handle AutoComplete on commands
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isAutocomplete()) return;

	const focusedOption = interaction.options.getFocused(true);
	let choices = [];

	if (!focusedOption.name === 'name') return
	let id = interaction.guild.id.toString()
	filter = interaction.options._hoistedOptions[0].value
	if (filter) {
		await queryKeysFilter(id, filter).then(res => res ? res.forEach(ele => { choices.push(ele.name) }) : null)
		choices = await isSimilar(id, filter, choices)
	}
	else {
		await queryKeys(id).then(res => res ? res.forEach(ele => { choices.push(ele['name']) }) : null)
	}
	const filtered = choices.sort((a, b) => (a.toUpperCase()[0] > b.toUpperCase()[0]) ? 1 : -1).splice(0, 25)
	await interaction.respond(filtered.map(choice => ({ name: choice, value: choice })));
});

client.login(process.env.token);
