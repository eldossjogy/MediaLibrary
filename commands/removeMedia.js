const { SlashCommandBuilder } = require('discord.js');
const { deleteData } = require('../db/dbCommands');
const { hasMedia } = require('../util/hasMedia');
const { hasManager } = require('../util/hasRole');
const { isAuthor } = require('../util/isAuthor');
const { tableExists } = require('../util/tableCheck');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removemedia')
		.setDescription('Delete a media for the library by name')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('Name of the media')
				.setRequired(true)
				.setAutocomplete(true)
		),	
	async execute(interaction) {
		let id = "id" + interaction.guild.id
		let userId = interaction.member.id
        if (hasManager(interaction.member) || isAuthor(id, interaction.options.getString('name'),userId)) {
			if (await tableExists) {
				let id = "id" + interaction.guild.id
				if (await hasMedia(id, interaction.options.getString('name'))){
					if (await deleteData(id, interaction.options.getString('name'))) {
						res = `The media ${interaction.options.getString('name')} has been removed from the library.`;
					}
					else {
						res = "Something went wrong with the database."
					}
				}
				else {
					res = `The media ${interaction.options.getString('name')} does not exist.`
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