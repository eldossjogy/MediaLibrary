const { SlashCommandBuilder } = require('discord.js');
const { createTable } = require("../db/dbCommands");
const { hasAdmin } = require('../util/hasRole');
const { tableExists } = require('../util/tableCheck');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('createlibrary')
		.setDescription('Creates a library for this server to store media'),
	async execute(interaction) {
		let id = "id" + interaction.guild.id

		if (!(hasAdmin(interaction.member))) {
			return await interaction.reply({ content: "You are not authorized to use this command. Only users with the 'Ban Members' or server admins can use this command.", ephemeral: true });
		}

		if (await tableExists(id)) {
			return await interaction.reply("This server is already has a media library.")
		}

		if (!(await createTable(id))) {
			return await interaction.reply("Something went wrong with the database.")
		}
		
		return await interaction.reply("A media library has been created for the server.")
	},
};
