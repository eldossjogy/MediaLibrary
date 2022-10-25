const { SlashCommandBuilder } = require('discord.js');
const { deleteTable } = require('../db/dbCommands');
const { hasAdmin } = require('../util/hasRole');
const { tableExists } = require('../util/tableCheck');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deletelibrary')
		.setDescription('Delete the library for this server storing media'),
	async execute(interaction) {
		if (hasAdmin(interaction.member)) {
			let id = "id" + interaction.guild.id
			if (await tableExists(id)) {
				if (await deleteTable(id)) {
					res = "This servers media library has been DELETED.";
				}
				else
				{
					res = "Something went wrong with the database."
				}
			}
			else {
				res = "A media library does not exist.";
			}
		}
		else {
			res = { content: "You are not authorized to use this command. Only users with the 'Ban Members' or server admins can use this command.", ephemeral: true }
		}
		await interaction.reply(res);
	},
};