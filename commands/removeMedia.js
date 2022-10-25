const { SlashCommandBuilder } = require('discord.js');
const { deleteData } = require('../db/dbCommands');
const { hasManager } = require('../util/hasRole');
const { tableExists } = require('../util/tableCheck');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removemedia')
		.setDescription('Delete a media for the library by name')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('Name of the media')
				.setRequired(true)
		),
	async execute(interaction) {
		if (hasManager(interaction.member)) {
			if (await tableExists) {
				let id = "id" + interaction.guild.id
				if (await deleteData(id, interaction.options.getString('name'))) {
					res = `The media ${interaction.options.getString('name')} has been removed from the library.`;
				}
				else {
					res = "Something went wrong with the database."
				}
			}
			else {
				res = "A media library does not exist.";
			}
		}
		else {
			res = { content: "You are not authorized to use this command. Only users with the 'Manage Messages' permission or higher can use this command.", ephemeral: true }
		}
		await interaction.reply(res);
	},
};