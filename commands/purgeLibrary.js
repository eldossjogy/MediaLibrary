const { SlashCommandBuilder } = require('discord.js');
const { clearTable } = require('../db/dbCommands');
const { hasAdmin } = require('../util/hasRole');
const { tableExists } = require('../util/tableCheck');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wipelibrary')
		.setDescription('Empty the library removing all media'),
	async execute(interaction) {
		let id = "id" + interaction.guild.id

		if (!(hasAdmin(interaction.member))) {
			return await interaction.reply({ content: "You are not authorized to use this command. Only users with the 'Ban Members' or server admins can use this command.", ephemeral: true })
		}

		if (!(await tableExists(id))) {
			return await interaction.reply("A media library does not exist.");
		}

		if (!(await clearTable(id))) {
			return await interaction.reply("Something went wrong with the database.");
		}

		return await interaction.reply("This servers media library has been PURGED.");
	},
};