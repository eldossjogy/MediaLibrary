const { SlashCommandBuilder } = require('discord.js');
const { createTable } = require("../db/dbCommands");
const { hasAdmin } = require('../util/hasRole');
const { tableExists } = require('../util/tableCheck');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('createlibrary')
		.setDescription('Creates a library for this server to store media'),
	async execute(interaction) {
		if (hasAdmin(interaction.member)) {
			let id = "id" + interaction.guild.id
			if (await tableExists(id)) {
				res = "This server is already has a media library.";
			}
			else {
				if (await createTable(id)) {
					res = "A media library has been created for the server.";
				}
				else {
					res = "Something went wrong with the database."
				}
			}
		}
		else {
			res = { content: "You are not authorized to use this command. Only users with the 'Ban Members' or server admins can use this command.", ephemeral: true }
		}
		await interaction.reply(res);
	},
};
